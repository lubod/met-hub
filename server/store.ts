import { createClient, commandOptions } from "redis";
import { AllStationsCfg, IStation } from "../common/allStationsCfg";
import { StationType } from "../common/stationType";
import { Dom } from "./dom";
import { store } from "./db";
import redisClient from "./redisClient";

const client = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

client.on("error", (err) => console.error("Store Redis Client Error", err));

async function main(stations: Map<string, IStation>) {
  await client.connect();

  let currentId = "0"; // Start at lowest possible stream ID
  let retryDelay = 1000; // Start at 1s, cap at 60s

  // eslint-disable-next-line no-constant-condition
  while (true) {
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
            const o = JSON.parse(msg.message.m);
            o.timestamp = new Date(o.timestamp);
            // eslint-disable-next-line no-await-in-loop
            await store(station.measurement, o);
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
      console.error(`store loop error (retry in ${retryDelay}ms):`, err);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retryDelay = Math.min(retryDelay * 2, 60000); // exponential backoff, cap at 60s
    }
  }
}

const allStationsCfg = new AllStationsCfg();
const dom = new Dom();
redisClient
  .connect()
  .then(() => allStationsCfg.readCfg())
  .then(() => {
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
