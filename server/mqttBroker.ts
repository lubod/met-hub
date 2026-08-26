import crypto from "crypto";
import { WebSocketServer } from "ws";
import type { Server as HttpServer } from "http";
import { Aedes, Client, PublishPacket, Subscription } from "aedes";
import type { Duplex } from "node:stream";
import websocketStream from "websocket-stream";
import redisClient from "./redisClient";
import { getSettings } from "./settings";
import { allStationsCfg } from "./state";
import { STATION_SENSORS } from "../common/stationModel";
import { DOM_SENSORS } from "../common/domModel";

/**
 * Embedded MQTT broker (aedes v5, created via Aedes.createBroker so the
 * in-memory persistence is wired) served over WebSocket at
 * wss://<host>/mqtt.
 *
 * Users authenticate with credentials from POST /api/mqtt/credentials and
 * may subscribe to their own stations, public stations and (for the Dom
 * account) the Dom topics. Publishing is denied for clients — met-hub is
 * the only publisher.
 */

const MAX_CLIENTS = 100;
const MAX_PER_USER = 3;
const DEVICE_CLASS: Record<string, string> = {
  temp: "temperature",
  tempin: "temperature",
  feelslike: "temperature",
  dewpt: "temperature",
  humidity: "humidity",
  humidityin: "humidity",
  pressureabs: "pressure",
  pressurerel: "pressure",
  windspeed: "wind_speed",
  windgust: "wind_speed",
  maxdailygust: "wind_speed",
  rainrate: "precipitation_intensity",
  eventrain: "precipitation",
  hourlyrain: "precipitation",
  dailyrain: "precipitation",
  weeklyrain: "precipitation",
  monthlyrain: "precipitation",
  totalrain: "precipitation",
};
const TOTAL_INCREASING: ReadonlySet<string> = new Set([
  "eventrain",
  "hourlyrain",
  "dailyrain",
  "weeklyrain",
  "monthlyrain",
  "totalrain",
]);

let broker: Aedes | null = null;
let wss: WebSocketServer | null = null;
const clientsByUser: Map<string, number> = new Map();
const allowedByClient: WeakMap<object, string[]> = new WeakMap();

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function topicMatches(topic: string, filter: string): boolean {
  const f = filter.split("/");
  const t = topic.split("/");
  for (let i = 0; i < f.length; i += 1) {
    if (f[i] === "#") return true;
    if (f[i] === "+") {
      if (i >= t.length) return false;
      continue;
    }
    if (t[i] !== f[i]) return false;
  }
  return f.length === t.length;
}

async function buildAllowedTopics(userId: string): Promise<string[]> {
  const patterns = [`methub/discovery/${userId}/#`];
  const owned = allStationsCfg.getStationsByUser(userId);
  if (owned) for (const id of owned) patterns.push(`methub/${id}/#`);
  for (const id of allStationsCfg.getPublicStations()) patterns.push(`methub/${id}/#`);
  return patterns;
}

function totalClients(): number {
  let total = 0;
  for (const n of clientsByUser.values()) total += n;
  return total;
}

function sensorConfigs(
  base: string,
  discoveryPrefix: string,
  stationId: string,
  place: string,
  sensors: ReadonlyArray<{ col: string; unit: string; label: string }>,
): Array<{ topic: string; payload: string }> {
  const stateTopic = `${base}/${stationId}/state`;
  return sensors
    .filter((s) => s.unit !== "")
    .map((s) => ({
      topic: `${discoveryPrefix}/homeassistant/sensor/methub_${stationId}_${s.col}/config`,
      payload: JSON.stringify({
        name: `${place} ${s.label || s.col}`,
        unique_id: `methub_${stationId}_${s.col}`,
        state_topic: stateTopic,
        value_template: `{{ value_json.${s.col} }}`,
        ...(s.unit ? { unit_of_measurement: s.unit } : {}),
        ...(DEVICE_CLASS[s.col] ? { device_class: DEVICE_CLASS[s.col] } : {}),
        state_class: TOTAL_INCREASING.has(s.col) ? "total_increasing" : "measurement",
        availability_topic: `${base}/${stationId}/availability`,
        payload_available: "online",
        payload_not_available: "stale",
      }),
    }));
}

export function publish(topic: string, payload: string, retain = false): void {
  if (!broker || !getSettings().mqtt.enabled) return;
  const packet: PublishPacket = {
    cmd: "publish",
    topic,
    payload: Buffer.from(payload),
    qos: 0,
    dup: false,
    retain,
  };
  broker.publish(packet, (err) => {
    if (err) console.warn(`mqtt: publish ${topic} failed:`, err.message);
  });
}

export function publishLast(stationId: string, payload: unknown): void {
  publish(`${getSettings().mqtt.topicBase}/${stationId}/state`, JSON.stringify(payload), true);
}

export function publishMinute(stationId: string, payload: unknown): void {
  publish(`${getSettings().mqtt.topicBase}/${stationId}/minute`, JSON.stringify(payload));
}

export function publishAvailability(stationId: string, online: boolean): void {
  publish(
    `${getSettings().mqtt.topicBase}/${stationId}/availability`,
    online ? "online" : "stale",
    true,
  );
}

function publishDiscoveryForStation(stationId: string, ownerId: string): void {
  const station = allStationsCfg.getStationByID(stationId);
  if (station == null || !ownerId) return;
  const base = getSettings().mqtt.topicBase;
  const prefix = `methub/discovery/${ownerId}`;
  const sensors =
    stationId === "dom"
      ? DOM_SENSORS.filter((s) => s.unit !== "")
      : STATION_SENSORS;
  for (const cfg of sensorConfigs(base, prefix, stationId, station.place, sensors)) {
    publish(cfg.topic, cfg.payload, true);
  }
}

async function republishAll(): Promise<void> {
  const base = getSettings().mqtt.topicBase;
  for (const [id, station] of allStationsCfg.getStations()) {
    if (!station.owner) continue;
    const measurement = allStationsCfg.getStationByID(id)?.measurement;
    if (measurement == null) continue;
    publishDiscoveryForStation(id, station.owner);
    // Sequential on purpose: retained messages land in deterministic order.
    // eslint-disable-next-line no-await-in-loop
    const raw = await redisClient.get(measurement.getRedisLastDataKey());
    if (raw != null) publish(`${base}/${id}/state`, raw, true);
    publish(`${base}/${id}/availability`, "stale", true);
  }
}

export function connectedClients(): number {
  return totalClients();
}

export async function initMqttBroker(httpServer: HttpServer): Promise<void> {
  // v5: createBroker wires persistence + heartbeat; `new Aedes()` alone
  // leaves persistence undefined and crashes on the first retained publish.
  const instance = await Aedes.createBroker({});

  instance.authenticate = (client, username, password, done) => {
    const userId = String(username ?? "");
    const token = String(password ?? "");
    if (!userId || !token) {
      done(null, false);
      return;
    }
    redisClient
      .hGet("MQTT_CREDS", userId)
      .then(async (stored) => {
        if (stored == null || stored !== sha256(token)) {
          done(null, false);
          return;
        }
        const allowed = await buildAllowedTopics(userId);
        allowedByClient.set(client, allowed);
        done(null, true);
      })
      .catch(() => done(null, false));
  };

  instance.authorizeSubscribe = (client, subscription, done) => {
    const allowed: string[] = allowedByClient.get(client) ?? [];
    const permitted = allowed.some((filter) => topicMatches(subscription.topic, filter));
    done(null, permitted ? subscription : null);
  };

  instance.authorizePublish = (_client, _packet, callback) => {
    callback(new Error("MQTT access is read-only"));
  };

  instance.on("client", (client: Client) => {
    const user = String((client as { username?: string }).username ?? "anonymous");
    clientsByUser.set(user, (clientsByUser.get(user) ?? 0) + 1);
  });
  instance.on("clientDisconnect", (client: Client) => {
    const user = String((client as { username?: string }).username ?? "anonymous");
    const n = (clientsByUser.get(user) ?? 1) - 1;
    if (n <= 0) clientsByUser.delete(user);
    else clientsByUser.set(user, n);
  });

  broker = instance;

  // ws sockets don't emit byte-stream events; websocket-stream bridges them
  // into the duplex stream aedes' MQTT parser consumes. The cast bridges the
  // @types/ws socket to the DOM WebSocket websocket-stream's types expect.
  wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });
  wss.on("connection", (ws) => {
    instance.handle(websocketStream(ws as never));
  });
  httpServer.on("upgrade", (req, socket, head) => {
    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    if (pathname !== "/mqtt") return;
    if (!getSettings().mqtt.enabled || connectedClients() >= MAX_CLIENTS) {
      socket.destroy();
      return;
    }
    wss?.handleUpgrade(req, socket, head, (ws) => {
      instance.handle(websocketStream(ws as never));
    });
  });

  // Retained discovery/state republish: HA recovers after restarts, and
  // stays in sync when stations are added via the config-change channel.
  republishAll().catch((err) => console.error("mqtt: republish failed:", err));
  redisClient
    .duplicate()
    .connect()
    .then((sub) =>
      sub.subscribe("STATIONS_CFG_CHANGED", (id) => {
        republishAll().catch((err) =>
          console.error(`mqtt: republish after ${id} failed:`, err),
        );
      }),
    )
    .catch((err) => console.error("mqtt: discovery sync unavailable:", err));
}

