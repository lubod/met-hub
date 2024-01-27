/* eslint-disable no-multi-str */
import { Pool } from "pg";
import { AllStationsCfg } from "../common/allStationsCfg";
import { IDomDataRaw } from "../common/domModel";
import { IStationData } from "../common/stationModel";
import { IMeasurement } from "./measurement";

const PG_PORT = parseInt(process.env.PG_PORT, 10) || 5432;
const PG_PASSWORD = process.env.PG_PASSWORD || "postgres";
const PG_DB = process.env.PG_DB || "postgres";
const PG_HOST = process.env.PG_HOST || "localhost";
const PG_USER = process.env.PG_USER || "postgres";

console.info("PG", PG_HOST);

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB,
  password: PG_PASSWORD,
  port: PG_PORT,
});

function checkInput(
  table: string,
  stationID: string,
  column: string,
  extraColumn: string,
  allStationsCfg: AllStationsCfg,
) {
  const station = allStationsCfg.getStationByID(stationID);
  const tables = station.measurement.getTables();
  const sensors = station.measurement.getSensors();
  const columns = sensors.map((s) => s.col);
  // console.info(stationID, table, tables, column, columns);
  if (tables.includes(table) && columns.includes(column)) {
    if (extraColumn === "") {
      return true;
    }
    if (columns.includes(extraColumn)) {
      return true;
    }
  }
  return false;
}

// select timestamp, tempin from station_${stationID} where timestamp >= '2020-08-13 09:20:54+00' and timestamp <= '2020-08-13 10:00:31+00';
export async function loadData(
  stationID: string,
  start: Date,
  end: Date,
  measurement: string,
  allStationsCfg: AllStationsCfg,
) {
  const diffMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
  const interval = Math.ceil(diffMinutes / 500.0);
  console.info(end, start, diffMinutes, interval);
  const timestampStart = `${start
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")}+00`;
  const timestampEnd = `${end.toISOString().slice(0, 19).replace("T", " ")}+00`;
  const client = await pool.connect();
  try {
    console.info("connected", new Date());

    const dbd = measurement.split(":");
    if (dbd.length >= 1) {
      const column = dbd[0];
      const extraColumn = dbd.length >= 2 ? `${dbd[1]}` : "";
      const table = `station_${stationID}`;

      if (checkInput(table, stationID, column, extraColumn, allStationsCfg)) {
        let queryText = `WITH intervals as ( \
            SELECT gs as start, gs + '${interval} minutes'::interval as end, ROW_NUMBER() over () as grp \
            FROM generate_series ('${timestampStart}', '${timestampEnd}', '${interval} minutes'::interval) gs \
          ), create_grp as ( \
            SELECT i.grp, i.start, i.end, s.${column}, s.timestamp \
            FROM ${table} s \
            RIGHT JOIN intervals i \
              ON s.timestamp >= i.start AND s.timestamp < i.end \
          ) \
          SELECT grp, EXTRACT(EPOCH FROM start) * 1000 as timestamp, min(${column}), max(${column}) \
          FROM create_grp \
          GROUP BY grp, start \
          ORDER BY grp`;

        // select timestamp,sum(rain::int) as rain from vonku group by timestamp order by timestamp asc
        /*
        let queryText = `select timestamp,${column}${
          extraColumn === "" ? "" : ","
        }${extraColumn} from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' order by timestamp asc`;
        if (table === "vonku" && column === "rain") {
          queryText = `select timestamp,cast(${column} as int) as rain from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' order by timestamp asc`;
        } else if (table.startsWith("station") && column === "hourlyrain") {
          queryText = `select DATE_TRUNC('hour',timestamp, 'CEST') as timestamp, coalesce(max(${column}), 0.0) as ${column} from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' group by DATE_TRUNC('hour',timestamp, 'CEST') order by timestamp asc`;
        } else if (table.startsWith("station") && column === "dailyrain") {
          queryText = `select DATE_TRUNC('day',timestamp, 'CEST') as timestamp, coalesce(max(${column}), 0.0) as ${column} from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' group by DATE_TRUNC('day',timestamp, 'CEST') order by timestamp asc `;
        } else if (table.startsWith("station") && column === "weeklyrain") {
          queryText = `select DATE_TRUNC('week',timestamp + interval '1day','CEST') as timestamp, coalesce(max(${column}), 0.0) as ${column} from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' group by DATE_TRUNC('week',timestamp  + interval '1day','CEST') order by timestamp asc`;
        } else if (table.startsWith("station") && column === "monthlyrain") {
          queryText = `select DATE_TRUNC('month',timestamp, 'CEST') as timestamp, coalesce(max(${column}), 0.0) as ${column} from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' group by DATE_TRUNC('month',timestamp,'CEST') order by timestamp asc`;
        }
        if (extraColumn === "kuri") {
          queryText = `select timestamp,${column},cast(${extraColumn} as int) as kuri from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' order by timestamp asc`;
        }
        */
        const resData = await client.query(queryText);
        // console.log("rows", queryText, typeof res.rows, res.fields);

        queryText = `
        SELECT min(${column}), max(${column}), avg(${column}) \
        FROM ${table} \
        WHERE timestamp >= '${timestampStart}' AND timestamp < '${timestampEnd}'`;
        const resStats = await client.query(queryText);
        const min = resStats.rows.length > 0 ? resStats.rows[0].min : null;
        const max = resStats.rows.length > 0 ? resStats.rows[0].max : null;
        const avg = resStats.rows.length > 0 ? resStats.rows[0].avg : null;

        queryText = `
        SELECT ${column} as first \
        FROM ${table} \
        WHERE timestamp >= '${timestampStart}' AND timestamp < '${timestampEnd}' ORDER BY timestamp ASC LIMIT 1`;
        const resStatsF = await client.query(queryText);
        const first =
          resStatsF.rows.length > 0 ? resStatsF.rows[0].first : null;

        queryText = `
        SELECT ${column} as last \
        FROM ${table} \
        WHERE timestamp >= '${timestampStart}' AND timestamp < '${timestampEnd}' ORDER BY timestamp DESC LIMIT 1`;
        const resStatsL = await client.query(queryText);
        const last = resStatsL.rows.length > 0 ? resStatsL.rows[0].last : null;

        return { stats: { min, max, avg, first, last }, data: resData.rows };
        // eslint-disable-next-line no-else-return
      } else {
        console.error("Wrong input", table, column, extraColumn);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    console.info("released");
  }
  return null;
}

export async function loadRainData(stationID: string) {
  const client = await pool.connect();
  try {
    console.info("connected", new Date());
    const intervals = [
      "1hour",
      "3hour",
      "6hour",
      "12hour",
      "1day",
      "3day",
      "1week",
      "4week",
    ];
    const res = [];
    const table = `station_${stationID}`;
    for (const interval of intervals) {
      const queryText = `WITH minuterain as (WITH hour_coef as (select DATE_TRUNC('hour',timestamp) as hour, sum(rainrate) as rainrate_sum, max(hourlyrain) as hourlyrain_max, max(hourlyrain)/NULLIF(sum(rainrate),0) as coef from ${table} where timestamp > current_timestamp - '${interval}'::interval group by DATE_TRUNC('hour', timestamp)) select station_${stationID}.timestamp,station_${stationID}.rainrate,station_${stationID}.hourlyrain, station_${stationID}.solarradiation, hour_coef.hour, hour_coef.rainrate_sum, hour_coef.hourlyrain_max, hour_coef.coef, station_${stationID}.rainrate*hour_coef.coef as minuterain from station_${stationID},hour_coef where DATE_TRUNC('hour', station_${stationID}.timestamp) = hour_coef.hour and station_${stationID}.rainrate > 0) select coalesce(sum(minuterain.minuterain), 0) from minuterain where timestamp > current_timestamp - '${interval}'::interval;`;
      // eslint-disable-next-line no-await-in-loop
      const r = await client.query(queryText);
      res.push({ interval, sum: r.rows[0].coalesce });
    }
    // console.log("rows", queryText, typeof res.rows, res.fields);
    return res;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    console.info("released");
  }
  return null;
}

function getQuery(id: string, entries: [string, any][]) {
  let qtext = `insert into station_${id} (`;
  let qtextv = "";
  const qarr = [];
  let i = 1;
  for (const [sensor, value] of entries) {
    if (
      // todo
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

export async function store(
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

export async function create(id: string) {
  const dbclient = await pool.connect();
  try {
    console.info(`connected create ${id}`);
    await dbclient.query("BEGIN");
    let qtext = `CREATE TABLE public.station_${id} ( 
      "timestamp" timestamp with time zone NOT NULL,
      tempin numeric(4,1),
      humidityin numeric(3,0),
      pressurerel numeric(6,1),
      pressureabs numeric(6,1),
      temp numeric(4,1),
      humidity numeric(3,0),
      winddir numeric(3,0),
      windspeed numeric(4,1),
      windgust numeric(4,1),
      rainrate numeric(5,1),
      solarradiation numeric(6,1),
      uv numeric(2,0),
      eventrain numeric(5,1),
      hourlyrain numeric(5,1),
      dailyrain numeric(5,1),
      weeklyrain numeric(5,1),
      monthlyrain numeric(5,1)
    )`;
    dbclient.query(qtext);
    qtext = `ALTER TABLE public.station_${id} OWNER TO postgres`;
    dbclient.query(qtext);
    qtext = `ALTER TABLE ONLY public.station_${id} ADD CONSTRAINT station_${id}_pkey PRIMARY KEY ("timestamp")`;
    dbclient.query(qtext);
    await dbclient.query("COMMIT");
  } catch (e) {
    await dbclient.query("ROLLBACK");
    console.error(e);
  } finally {
    dbclient.release();
    console.info("released");
  }
}
