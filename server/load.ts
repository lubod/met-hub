import { Pool } from "pg";
import { Dom, TABLES } from "./dom";
import Station from "./station";

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

const station = new Station();
const dom = new Dom();

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

function checkInput(table: string, column: string, extraColumn: string) {
  const sc = station.getColumns();
  const dc = dom.getColumns();
  const st = station.getTables();
  const dt = dom.getTables();
  if (!st.includes(table) && !dt.includes(table as TABLES)) {
    console.error(`Wrong table: ${table}`);
    return false;
  }
  if (!sc.includes(column) && !dc.includes(column)) {
    console.error(`Wrong column: ${column}`);
    return false;
  }
  if (
    extraColumn !== "" &&
    !sc.includes(extraColumn) &&
    !dc.includes(extraColumn)
  ) {
    console.error(`Wrong extraColumn: ${extraColumn}`);
    return false;
  }
  return true;
}

// select timestamp, tempin from stanica where timestamp >= '2020-08-13 09:20:54+00' and timestamp <= '2020-08-13 10:00:31+00';
async function loadData(start: Date, end: Date, measurement: string) {
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
      
      if (checkInput(table, column, extraColumn)) {
        // select timestamp,sum(rain::int) as rain from vonku group by timestamp order by timestamp asc
        let queryText = `select timestamp,${column}${extraColumn === "" ? "" : ","}${extraColumn} from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' order by timestamp asc`;
        if (table === "vonku" && column === "rain") {
          queryText = `select timestamp,cast(${column} as int) as rain from ${table} where timestamp>='${timestampStart}' and timestamp<='${timestampEnd}' order by timestamp asc`;
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

export default loadData;
