import { Pool } from "pg";
import { AllStationsCfg } from "../common/allStationsCfg";

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

function minmax(arr: any, index: number, window: number, column: string) {
  let minIndex = index;
  let maxIndex = index;
  let minValue = parseFloat(arr[minIndex][column]);
  let maxValue = parseFloat(arr[maxIndex][column]);

  // const val = parseFloat(arr[index][column]);
  // console.info("in", val);
  for (let i = 1; i < window; i += 1) {
    const value = parseFloat(arr[index + i][column]);
    // console.info("in", value);
    if (value < minValue) {
      minIndex = index + i;
      minValue = value;
    } else if (value > maxValue) {
      maxIndex = index + i;
      maxValue = value;
    }
  }
  // console.info("push", arr[minIndex], arr[maxIndex]);
  if (minIndex < maxIndex) {
    return { x: minIndex, y: maxIndex };
  }
  if (minIndex > maxIndex) {
    return { x: maxIndex, y: minIndex };
  }
  return { x: maxIndex, y: null };
}

function checkInput(
  table: string,
  column: string,
  extraColumn: string,
  allStationsCfg: AllStationsCfg
) {
  const stationID = table.startsWith("station") ? table.split("_")[1] : "dom"; // todo
  const station = allStationsCfg.getStationByID(stationID);
  const tables = station.measurement.getTables();
  const columns = station.measurement.getColumns();
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
  start: Date,
  end: Date,
  measurement: string,
  allStationsCfg: AllStationsCfg
) {
  const timestampStart = `${start
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")}+00`;
  const timestampEnd = `${end.toISOString().slice(0, 19).replace("T", " ")}+00`;
  const client = await pool.connect();
  try {
    console.info("connected", new Date());

    const dbd = measurement.split(":");
    if (dbd.length >= 2) {
      const table = dbd[0];
      const column = dbd[1];
      const extraColumn = dbd.length >= 3 ? `${dbd[2]}` : "";

      if (checkInput(table, column, extraColumn, allStationsCfg)) {
        // select timestamp,sum(rain::int) as rain from vonku group by timestamp order by timestamp asc
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
        const res = await client.query(queryText);
        // console.log("rows", queryText, typeof res.rows, res.fields);
        if (res.rows.length > 1500) {
          const window = Math.ceil(res.rows.length / 1500) * 2;
          console.info(res.rows.length, window);
          const res2 = [];
          let i = 0;
          for (; i < res.rows.length - window; i += window) {
            const r = minmax(res.rows, i, window, column);
            res2.push(res.rows[r.x]);
            if (r.y != null) {
              res2.push(res.rows[r.y]);
            } else {
              // console.info(null);
            }
          }
          if (res.rows.length - i > 3) {
            const r = minmax(res.rows, i, res.rows.length - i - 1, column);
            res2.push(res.rows[r.x]);
            if (r.y != null) {
              res2.push(res.rows[r.y]);
            }
          }
          res2.push(res.rows[res.rows.length - 1]);
          return res2;
        }
        return res.rows;
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
