import { AllStationsCfg } from "../common/allStationsCfg";
import { IDomDataRaw } from "../common/domModel";
import { IStationData } from "../common/stationModel";
import { Dom } from "./dom";
import { IMeasurement } from "./measurement";
import pool from "./pgPool";

const dom = new Dom();

function getMeasurement(
  stationID: string,
  allStationsCfg: AllStationsCfg,
): IMeasurement | null {
  if (stationID === "dom") {
    return dom;
  }
  const station = allStationsCfg.getStationByID(stationID);
  return station?.measurement ?? null;
}

// Validate that the requested table and columns are known for the given station
function checkInput(
  stationID: string,
  column: string,
  extraColumn: string,
  allStationsCfg: AllStationsCfg,
): boolean {
  const meas = getMeasurement(stationID, allStationsCfg);
  if (meas == null) return false;
  const sensors = meas.getSensors();
  const columns = sensors.map((s) => s.col);
  if (!columns.includes(column)) return false;
  if (extraColumn !== "" && !columns.includes(extraColumn)) return false;
  return true;
}

export async function loadData(
  stationID: string,
  start: Date,
  end: Date,
  measurement: string,
  allStationsCfg: AllStationsCfg,
) {
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(stationID) || stationID.length > 64) {
    throw new Error(`Invalid stationID: ${stationID}`);
  }
  const diffMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
  const interval = Math.ceil(diffMinutes / 500.0);
  const timestampStart = `${start.toISOString().slice(0, 19).replace("T", " ")}+00`;
  const timestampEnd = `${end.toISOString().slice(0, 19).replace("T", " ")}+00`;
  const client = await pool.connect();
  try {
    if (!measurement || measurement.startsWith(":")) {
      console.error("Invalid measurement format", measurement);
      return null;
    }
    const dbd = measurement.split(":");
    const column = dbd[0];
    const extraColumn = dbd.length >= 2 ? dbd[1] : "";

    if (!checkInput(stationID, column, extraColumn, allStationsCfg)) {
      console.error("Wrong input", stationID, column, extraColumn);
      return null;
    }

    const table = `station_${stationID}`;

    // Table and column names are validated by checkInput against the allowlist.
    // Timestamps and interval come from controlled values and are safe.
    const [resData, resStats] = await Promise.all([
      client.query(
        `WITH intervals AS (
          SELECT gs AS start, gs + $1::text::interval AS end, ROW_NUMBER() OVER () AS grp
          FROM generate_series ($2::timestamptz, $3::timestamptz, $1::text::interval) gs
        ), create_grp AS (
          SELECT i.grp, i.start, i.end, s.${column}, s.timestamp
          FROM ${table} s
          RIGHT JOIN intervals i
            ON s.timestamp >= i.start AND s.timestamp < i.end
        )
        SELECT grp, EXTRACT(EPOCH FROM start) * 1000 AS timestamp, min(${column}), max(${column})
        FROM create_grp
        GROUP BY grp, start
        ORDER BY grp`,
        [`${interval} minutes`, timestampStart, timestampEnd],
      ),
      client.query(
        `SELECT
           min(${column}) AS min,
           max(${column}) AS max,
           avg(${column}) AS avg,
           (SELECT ${column} FROM ${table} WHERE timestamp >= $1 AND timestamp < $2 ORDER BY timestamp ASC  LIMIT 1) AS first,
           (SELECT ${column} FROM ${table} WHERE timestamp >= $1 AND timestamp < $2 ORDER BY timestamp DESC LIMIT 1) AS last
         FROM ${table}
         WHERE timestamp >= $1 AND timestamp < $2`,
        [timestampStart, timestampEnd],
      ),
    ]);

    const statsRow = resStats.rows[0];
    return {
      stats: {
        min: statsRow?.min ?? null,
        max: statsRow?.max ?? null,
        avg: statsRow?.avg ?? null,
        first: statsRow?.first ?? null,
        last: statsRow?.last ?? null,
      },
      data: resData.rows,
    };
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
  return null;
}

export async function loadRainData(stationID: string) {
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(stationID) || stationID.length > 64) {
    throw new Error(`Invalid stationID: ${stationID}`);
  }
  const client = await pool.connect();
  try {
    // Single query using conditional aggregation replaces 8 separate queries
    const table = `station_${stationID}`;
    const queryText = `
      WITH hour_coef AS (
        SELECT
          DATE_TRUNC('hour', timestamp) AS hour,
          max(hourlyrain) / NULLIF(sum(rainrate), 0) AS coef
        FROM ${table}
        WHERE timestamp > current_timestamp - '4 weeks'::interval
        GROUP BY DATE_TRUNC('hour', timestamp)
      ),
      minuterain AS (
        SELECT s.timestamp, s.rainrate * h.coef AS rain
        FROM ${table} s
        JOIN hour_coef h ON DATE_TRUNC('hour', s.timestamp) = h.hour
        WHERE s.rainrate > 0
      )
      SELECT
        coalesce(SUM(CASE WHEN timestamp > current_timestamp - '1 hour'::interval    THEN rain END), 0) AS "1hour",
        coalesce(SUM(CASE WHEN timestamp > current_timestamp - '3 hours'::interval   THEN rain END), 0) AS "3hour",
        coalesce(SUM(CASE WHEN timestamp > current_timestamp - '6 hours'::interval   THEN rain END), 0) AS "6hour",
        coalesce(SUM(CASE WHEN timestamp > current_timestamp - '12 hours'::interval  THEN rain END), 0) AS "12hour",
        coalesce(SUM(CASE WHEN timestamp > current_timestamp - '1 day'::interval     THEN rain END), 0) AS "1day",
        coalesce(SUM(CASE WHEN timestamp > current_timestamp - '3 days'::interval    THEN rain END), 0) AS "3day",
        coalesce(SUM(CASE WHEN timestamp > current_timestamp - '1 week'::interval    THEN rain END), 0) AS "1week",
        coalesce(SUM(rain), 0)                                                                          AS "4week"
      FROM minuterain`;

    const r = await client.query(queryText);
    if (r.rows.length === 0) return [];

    const row = r.rows[0];
    return [
      { interval: "1hour", sum: row["1hour"] },
      { interval: "3hour", sum: row["3hour"] },
      { interval: "6hour", sum: row["6hour"] },
      { interval: "12hour", sum: row["12hour"] },
      { interval: "1day", sum: row["1day"] },
      { interval: "3day", sum: row["3day"] },
      { interval: "1week", sum: row["1week"] },
      { interval: "4week", sum: row["4week"] },
    ];
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
  }
  return null;
}

function getQuery(id: string, entries: [string, any][]) {
  let qtext = `insert into station_${id} (`;
  let qtextv = "";
  let qtextu = "";
  const qarr = [];
  let i = 1;
  for (const [sensor, value] of entries) {
    if (
      sensor !== "place" &&
      sensor !== "maxdailygust" &&
      sensor !== "totalrain"
    ) {
      if (value != null) {
        qtext += `${sensor},`;
        qtextv += `$${i},`;
        if (sensor !== "timestamp") {
          qtextu += `${sensor} = EXCLUDED.${sensor},`;
        }
        i += 1;
        qarr.push(value);
      }
    }
  }
  qtext = qtext.slice(0, -1);
  qtextv = qtextv.slice(0, -1);
  qtextu = qtextu.slice(0, -1);
  qtext += `) values (${qtextv}) on conflict (timestamp) do update set ${qtextu}`;
  return { qtext, qarr };
}

export async function store(
  measurement: IMeasurement,
  data: IDomDataRaw | IStationData,
) {
  const stationID = measurement.getStationID();
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(stationID) || stationID.length > 64) {
    console.error(`store: invalid stationID "${stationID}", skipping`);
    return;
  }
  const dbclient = await pool.connect();
  try {
    await dbclient.query("BEGIN");
    const entries = Object.entries(data);
    const { qtext, qarr } = getQuery(measurement.getStationID(), entries);
    await dbclient.query(qtext, qarr);
    await dbclient.query("COMMIT");
  } catch (e) {
    await dbclient.query("ROLLBACK");
    console.error(e);
  } finally {
    dbclient.release();
  }
}

export async function create(id: string) {
  const dbclient = await pool.connect();
  try {
    await dbclient.query("BEGIN");
    await dbclient.query(`CREATE TABLE public.station_${id} (
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
      monthlyrain numeric(5,1),
      feelslike numeric(4,1),
      dewpt numeric(4,1)
    )`);
    await dbclient.query(`ALTER TABLE public.station_${id} OWNER TO postgres`);
    await dbclient.query(
      `ALTER TABLE ONLY public.station_${id} ADD CONSTRAINT station_${id}_pkey PRIMARY KEY ("timestamp")`,
    );
    await dbclient.query("COMMIT");
  } catch (e) {
    await dbclient.query("ROLLBACK");
    console.error(e);
  } finally {
    dbclient.release();
  }
}
