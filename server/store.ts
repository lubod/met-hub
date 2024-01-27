import { createClient, commandOptions } from "redis";
import { exit } from "process";
// eslint-disable-next-line import/no-extraneous-dependencies
import { RedisCommandArgument } from "@redis/client/dist/lib/commands";
import { AllStationsCfg, IStation } from "../common/allStationsCfg";
import { store } from "./db";


const client = createClient();

const currentId = "0"; // Start at lowest possible stream ID

async function main(stations: Map<string, IStation>) {
  await client.connect();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await client.xRead(
        commandOptions({
          isolated: true,
        }),
        [
          {
            key: "toStore",
            id: currentId,
          },
        ],
        {
          COUNT: 100,
          BLOCK: 60000,
        },
      );

      if (response) {
        const toDel: RedisCommandArgument[] = [];
        for (const res of response) {
          console.info(res.name);
          for (const msg of res.messages) {
            console.info(msg.id);
            const o = JSON.parse(msg.message.m);
            o.timestamp = new Date(o.timestamp);
            console.info(msg.message.id);
            store(stations.get(msg.message.id).measurement, o);
            toDel.push(msg.id);
          }
        }

        if (toDel.length > 0) {
          // eslint-disable-next-line no-await-in-loop
          await client.xDel("toStore", toDel);
        }
      } else {
        console.log("No new stream entries.");
      }
    } catch (err) {
      console.error(err);
      exit();
    }
  }
}

const allStationsCfg = new AllStationsCfg();
allStationsCfg.readCfg().then(() => main(allStationsCfg.getStations()));
