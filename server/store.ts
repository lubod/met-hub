import { Pool } from "pg";
import { createClient, commandOptions } from "redis";
import { exit } from "process";
// eslint-disable-next-line import/no-extraneous-dependencies
import { RedisCommandArgument } from "@redis/client/dist/lib/commands";
import { IStationData } from "../common/stationModel";
import { IDomDataRaw } from "../common/domModel";
import { IMeasurement } from "./measurement";
import { AllStationsCfg, IStation } from "../common/allStationsCfg";

const PG_PORT = parseInt(process.env.PG_PORT, 10) || 5432;
const PG_PASSWORD = process.env.PG_PASSWORD || "postgres";
const PG_DB = process.env.PG_DB || "postgres";
const PG_HOST = process.env.PG_HOST || "localhost";
const PG_USER = process.env.PG_USER || "postgres";

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB,
  password: PG_PASSWORD,
  port: PG_PORT,
});

const client = createClient();

const currentId = "0"; // Start at lowest possible stream ID

function getQuery(id: string, entries: [string, any][]) {
  let qtext = `insert into station_${id} (`;
  let qtextv = "";
  const qarr = [];
  let i = 1;
  for (const [sensor, value] of entries) {
    if (  // todo
      sensor !== "place" &&
      sensor !== "maxdailygust" &&
      sensor !== "dewpt" &&
      sensor !== "totalrain"
    ) {
      if (value != null) {
        qtext += `${sensor},`;
        qtextv += `$${i},`;
        i += 1;
        qarr.push(value);
      }
    }
  }
  qtext = qtext.slice(0, -1);
  qtext += `) values (${qtextv.slice(0, -1)})`;
  return { qtext, qarr };
  // return `insert into station_${id} (timestamp, tempin, humidityin, pressurerel, pressureabs, temp, humidity, winddir, windspeed, windgust, rainrate, solarradiation, uv, eventrain, hourlyrain, dailyrain, weeklyrain, monthlyrain) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`;
}

async function store(
  measurement: IMeasurement,
  data: IDomDataRaw | IStationData,
) {
  const dbclient = await pool.connect();
  try {
    console.info(`connected ${data.timestamp}`);
    await dbclient.query("BEGIN");
    const entries = Object.entries(data);
    const { qtext, qarr } = getQuery(measurement.getStationID(), entries);
    dbclient.query(qtext, qarr);
    await dbclient.query("COMMIT");
  } catch (e) {
    await dbclient.query("ROLLBACK");
    console.error(e);
  } finally {
    dbclient.release();
    console.info("released");
  }
}

async function main(stations: Map<string, IStation>) {
  await client.connect();
  console.info(`PG: ${PG_HOST}`);

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
