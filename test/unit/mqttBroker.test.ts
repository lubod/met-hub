import crypto from "crypto";
import { EventEmitter } from "events";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import type { Client, PublishPacket, Subscription } from "aedes";

import {
  initMqttBroker,
  republishAll,
  publishLast,
  publishMinute,
  publishAvailability,
} from "../../server/mqttBroker";

const brokerHolder = vi.hoisted(() => ({
  instance: null as {
    authenticate: (
      client: Client,
      username: Readonly<string>,
      password: Readonly<Buffer>,
      done: (err: Error | null, ok: boolean | null) => void,
    ) => void;
    authorizeSubscribe: (
      client: Client,
      sub: Subscription,
      done: (err: Error | null, sub?: Subscription | null) => void,
    ) => void;
    authorizePublish: (
      client: Client,
      packet: PublishPacket,
      cb: (err?: Error | null) => void,
    ) => void;
    publish: (packet: PublishPacket, cb?: (err?: Error) => void) => void;
  } | null,
  published: [] as Array<{ topic: string; payload: string; retain: boolean }>,
}));

const mqttSettings = vi.hoisted(() => ({
  enabled: true,
  haDiscovery: true,
  topicBase: "methub",
}));

const redisMock = vi.hoisted(() => ({
  get: vi.fn().mockResolvedValue(null),
  hGet: vi.fn().mockResolvedValue(null),
  hGetAll: vi.fn().mockResolvedValue({}),
  duplicate: vi.fn(() => ({
    on: vi.fn(),
    connect: vi.fn().mockResolvedValue(undefined),
    subscribe: vi.fn().mockResolvedValue(undefined),
  })),
}));

const stationsMap = vi.hoisted(
  () =>
    new Map([
      [
        "pub1",
        {
          id: "pub1",
          place: "Public Station",
          owner: "owner-pub",
          public: true,
          measurement: { getRedisLastDataKey: () => "station_pub1-last" },
        },
      ],
      [
        "priv1",
        {
          id: "priv1",
          place: "Private Station",
          owner: "user1",
          public: false,
          measurement: { getRedisLastDataKey: () => "station_priv1-last" },
        },
      ],
    ]),
);

vi.mock("aedes", async (importOriginal) => {
  const mod = await importOriginal<typeof import("aedes")>();
  return {
    ...mod,
    Aedes: {
      createBroker: async (opts?: unknown) => {
        const inst = await mod.Aedes.createBroker(opts as never);
        const typed = inst as unknown as NonNullable<typeof brokerHolder.instance>;
        brokerHolder.instance = typed;
        const origPublish = typed.publish.bind(typed);
        typed.publish = (packet: PublishPacket, cb?: (err?: Error) => void) => {
          brokerHolder.published.push({
            topic: packet.topic,
            payload: Buffer.isBuffer(packet.payload)
              ? packet.payload.toString("utf8")
              : String(packet.payload),
            retain: Boolean(packet.retain),
          });
          return origPublish(packet, cb);
        };
        return inst;
      },
    },
  };
});

vi.mock("../../server/redisClient", () => ({ default: redisMock }));

vi.mock("../../server/settings", () => ({
  SETTINGS_CHANGED: "SETTINGS_CHANGED",
  getSettings: () => ({ mqtt: mqttSettings }),
}));

vi.mock("../../server/state", () => ({
  allStationsCfg: {
    getStations: () => stationsMap,
    getStationByID: (id: string) => stationsMap.get(id),
    getStationsByUser: (uid: string) =>
      uid === "user1" ? new Set(["priv1"]) : new Set<string>(),
    getPublicStations: () => new Set(["pub1"]),
  },
}));

function sha256(v: string): string {
  return crypto.createHash("sha256").update(v).digest("hex");
}

describe("MQTT broker (mqttBroker.ts)", () => {
  beforeAll(async () => {
    await initMqttBroker(new EventEmitter() as never);
  });

  beforeEach(() => {
    brokerHolder.published.length = 0;
    mqttSettings.enabled = true;
    mqttSettings.haDiscovery = true;
    mqttSettings.topicBase = "methub";
    redisMock.get.mockReset().mockResolvedValue(null);
    redisMock.hGet.mockReset().mockResolvedValue(null);
    redisMock.hGetAll.mockReset().mockResolvedValue({});
  });

  it("authenticates valid credentials, builds ACLs including dom, and denies client publish", async () => {
    const broker = brokerHolder.instance!;
    expect(broker).not.toBeNull();

    const secret = "secret-token";
    redisMock.hGet.mockImplementation(async (hash: string, key: string) => {
      if (hash === "MQTT_CREDS" && key === "user1") return sha256(secret);
      if (hash === "USERS" && key === "admin") return "user1";
      return null;
    });

    // 1. Empty creds rejected
    const emptyOk = await new Promise<boolean | null>((resolve) => {
      broker.authenticate({} as Client, "", Buffer.from(""), (_err, ok) =>
        resolve(ok),
      );
    });
    expect(emptyOk).toBe(false);

    // 2. Wrong password rejected
    const badOk = await new Promise<boolean | null>((resolve) => {
      broker.authenticate({} as Client, "user1", Buffer.from("wrong"), (_err, ok) =>
        resolve(ok),
      );
    });
    expect(badOk).toBe(false);

    // 3. Valid token authenticates and populates ACL for clientRef
    const clientRef = {} as Client;
    const goodOk = await new Promise<boolean | null>((resolve) => {
      broker.authenticate(
        clientRef,
        "user1",
        Buffer.from(secret),
        (_err, ok) => resolve(ok),
      );
    });
    expect(goodOk).toBe(true);

    // 4. authorizeSubscribe checks allowed topics vs forbidden topics
    const checkSub = (topic: string) =>
      new Promise<Subscription | null | undefined>((resolve) => {
        broker.authorizeSubscribe(
          clientRef,
          { topic, qos: 0 } as Subscription,
          (_err, sub) => resolve(sub),
        );
      });

    expect((await checkSub("methub/pub1/state"))?.topic).toBe("methub/pub1/state");
    expect((await checkSub("methub/priv1/state"))?.topic).toBe("methub/priv1/state");
    expect((await checkSub("methub/dom/state"))?.topic).toBe("methub/dom/state");
    expect((await checkSub("methub/discovery/user1/#"))?.topic).toBe(
      "methub/discovery/user1/#",
    );
    expect(await checkSub("methub/other/state")).toBeNull();
    expect(await checkSub("#")).toBeNull();

    // 5. authorizePublish rejects client writes
    const pubErr = await new Promise<Error | null | undefined>((resolve) => {
      broker.authorizePublish(clientRef, {} as PublishPacket, (err) =>
        resolve(err),
      );
    });
    expect(pubErr?.message).toBe("MQTT access is read-only");
  });

  it("denies dom topic subscription for non-dom user", async () => {
    const broker = brokerHolder.instance!;
    const secret = "regular-secret";
    redisMock.hGet.mockImplementation(async (hash: string, key: string) => {
      if (hash === "MQTT_CREDS" && key === "user2") return sha256(secret);
      if (hash === "USERS" && key === "admin") return "admin-id";
      if (hash === "USERS" && key === "user2")
        return JSON.stringify({ email: "other@example.com" });
      return null;
    });

    const client2 = {} as Client;
    const ok = await new Promise<boolean | null>((resolve) => {
      broker.authenticate(
        client2,
        "user2",
        Buffer.from(secret),
        (_err, res) => resolve(res),
      );
    });
    expect(ok).toBe(true);

    const domSub = await new Promise<Subscription | null | undefined>((resolve) => {
      broker.authorizeSubscribe(
        client2,
        { topic: "methub/dom/state", qos: 0 } as Subscription,
        (_err, sub) => resolve(sub),
      );
    });
    expect(domSub).toBeNull();
  });

  it("publishes discovery configs when haDiscovery=true and clears them when haDiscovery=false", async () => {
    redisMock.hGet.mockImplementation(async (hash: string, key: string) =>
      hash === "USERS" && key === "admin" ? "user1" : null,
    );
    redisMock.get.mockImplementation(async (key: string) => {
      if (key === "station_pub1-last") return JSON.stringify({ temp: 12.3 });
      if (key === "dom-last") return JSON.stringify({ temp: 21.0 });
      return null;
    });

    // haDiscovery = true
    mqttSettings.haDiscovery = true;
    await republishAll();

    const domDiscovery = brokerHolder.published.find(
      (p) =>
        p.topic ===
        "methub/discovery/user1/homeassistant/sensor/methub_dom_temp/config",
    );
    expect(domDiscovery).toBeDefined();
    expect(domDiscovery?.retain).toBe(true);
    expect(domDiscovery?.payload).not.toBe("");
    expect(JSON.parse(domDiscovery!.payload)).toMatchObject({
      unique_id: "methub_dom_temp",
      state_topic: "methub/dom/state",
    });

    const domState = brokerHolder.published.find(
      (p) => p.topic === "methub/dom/state",
    );
    expect(domState?.payload).toBe(JSON.stringify({ temp: 21.0 }));
    expect(domState?.retain).toBe(true);

    // haDiscovery = false -> clears discovery with empty retained payload
    brokerHolder.published.length = 0;
    mqttSettings.haDiscovery = false;
    await republishAll();

    const clearedDiscovery = brokerHolder.published.filter((p) =>
      p.topic.includes("/homeassistant/sensor/"),
    );
    expect(clearedDiscovery.length).toBeGreaterThan(0);
    expect(clearedDiscovery.every((p) => p.payload === "" && p.retain)).toBe(true);
  });

  it("publishes last, minute, and availability payloads when enabled", () => {
    publishLast("pub1", { temp: 10 });
    publishMinute("pub1", { temp: 10.5 });
    publishAvailability("pub1", true);
    publishAvailability("pub1", false);

    expect(brokerHolder.published).toEqual(
      expect.arrayContaining([
        { topic: "methub/pub1/state", payload: JSON.stringify({ temp: 10 }), retain: true },
        { topic: "methub/pub1/minute", payload: JSON.stringify({ temp: 10.5 }), retain: false },
        { topic: "methub/pub1/availability", payload: "online", retain: true },
        { topic: "methub/pub1/availability", payload: "stale", retain: true },
      ]),
    );
  });
});
