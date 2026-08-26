import { createClient, commandOptions } from "redis";
import {
  AllStationsCfg,
  IStation,
  ALL_STATIONS_CFG,
  STATIONS_CFG_CHANGED,
} from "../common/allStationsCfg";
import { StationType } from "../common/stationType";
import { dom } from "./dom";
import { store } from "./db";
import redisClient from "./redisClient";

const client = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

client.on("error", (err) => console.error("Store Redis Client Error", err));

let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  console.info(`Store service received ${signal}. Starting graceful shutdown...`);
  isShuttingDown = true;
  try {
    await client.quit();
    console.info("Store Redis client disconnected.");
  } catch (err) {
    console.error("Error closing Store Redis client:", err);
  }

  try {
    await redisClient.disconnect();
    console.info("Store shared Redis client disconnected.");
  } catch (err) {
    console.error("Error disconnecting shared Redis:", err);
  }

  console.info("Store graceful shutdown finished. Exiting process.");
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

async function main(stations: Map<string, IStation>) {
  await client.connect();

  let currentId = "0"; // Start at lowest possible stream ID
  let retryDelay = 1000; // Start at 1s, cap at 60s

  while (!isShuttingDown) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await client.xRead(
        commandOptions({ isolated: true }),
        [{ key: "toStore", id: currentId }],
        { COUNT: 100, BLOCK: 60000 },
      );

      retryDelay = 1000; // reset on success

      if (response) {
        const toDel: string[] = [];
        for (const res of response) {
          for (const msg of res.messages) {
            const station = stations.get(msg.message.id);
            if (station == null) {
              console.warn(
                "store: unknown station ID",
                msg.message.id,
                "– skipping",
              );
              toDel.push(msg.id);
              continue;
            }
            try {
              const o = JSON.parse(msg.message.m);
              o.timestamp = new Date(o.timestamp);
              // eslint-disable-next-line no-await-in-loop
              await store(station.measurement, o);
            } catch (err) {
              console.error(
                `store: failed to process message ${msg.id} for station ${msg.message?.id || "unknown"}:`,
                err,
              );
              try {
                // eslint-disable-next-line no-await-in-loop
                await client.xAdd("toStore:DLQ", "*", {
                  originalId: msg.id,
                  m: msg.message?.m || "",
                  id: msg.message?.id || "",
                  error: err instanceof Error ? err.message : String(err),
                  failedAt: new Date().toISOString(),
                });
              } catch (dlqErr) {
                console.error("store: failed to write to DLQ:", dlqErr);
              }
            }
            toDel.push(msg.id);
            currentId = msg.id;
          }
        }

        if (toDel.length > 0) {
          // eslint-disable-next-line no-await-in-loop
          await client.xDel("toStore", toDel);
        }
      }
    } catch (err) {
      if (isShuttingDown) {
        break;
      }
      console.error(`store loop error (retry in ${retryDelay}ms):`, err);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retryDelay = Math.min(retryDelay * 2, 60000); // exponential backoff, cap at 60s
    }
  }
}

const allStationsCfg = new AllStationsCfg();

// Hot-reload a single station entry after an addStation in the web process;
// without this, aggregated minutes for new stations hit the unknown-ID branch
// and are dropped until restart.
async function reloadStation(id: string) {
  try {
    const raw = await redisClient.hGet(ALL_STATIONS_CFG, id);
    if (raw == null) return;
    const parsed = JSON.parse(raw) as Omit<IStation, "measurement">;
    const measurement = allStationsCfg.getMeas(parsed);
    allStationsCfg.set({ ...parsed, measurement });
    console.info("store: reloaded station config", id);
  } catch (err) {
    console.error(`store: failed to reload station config ${id}:`, err);
  }
}

async function startConfigWatcher() {
  // Pub/sub requires a dedicated connection; the main stream client cannot
  // enter subscriber mode while doing xRead.
  const sub = client.duplicate();
  await sub.connect();
  await sub.subscribe(STATIONS_CFG_CHANGED, (id) => {
    reloadStation(id).catch((err) => {
      console.error("store: reload failed:", err);
    });
  });
}

redisClient
  .connect()
  .then(() => allStationsCfg.readCfg())
  .then(async () => {
    // Hot-reload is an enhancement: if pub/sub cannot start, the store must
    // still consume the toStore stream.
    try {
      await startConfigWatcher();
    } catch (err) {
      console.error(
        "store: config watcher failed to start (no hot-reload):",
        err,
      );
    }
    const stations = allStationsCfg.getStations();
    stations.set(dom.getStationID(), {
      id: dom.getStationID(),
      lat: 0,
      lon: 0,
      type: StationType.Dom,
      place: "Dom",
      passkey: "",
      measurement: dom,
      public: false,
      owner: "",
    });
    return main(stations);
  })
  .catch((err) => {
    console.error("store: failed to start", err);
    process.exit(1);
  });
