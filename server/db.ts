import { AllStationsCfg } from "../common/allStationsCfg";
import { IDomDataRaw } from "../common/domModel";
import { IStationData } from "../common/stationModel";
import { dom } from "./dom";
import { IMeasurement } from "./measurement";
import pool from "./pgPool";
import {
  getDayOfYear,
  calculateHargreavesET0,
  calculatePenmanMonteithInstantaneousET0,
  round,
  DEFAULT_LAT,
} from "../common/units";

const pad2 = (n: number) => String(n).padStart(2, "0");

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function clampDt(dt: number): number {
  if (dt <= 0) return 1 / 288;
  if (dt > 1 / 24) return 1 / 24;
  return dt;
}

/**
 * Computes per-sample ET0 contribution (mm) and rain increment (mm) from raw
 * station rows. ET0 uses Penman-Monteith (falling back to Hargreaves when
 * solar/wind data is sparse), integrated over the time gap between samples.
 * Rain is derived as the delta of the cumulative `dailyrain` counter, which
 * resets at local midnight (negative deltas from counter resets are treated as
 * a new day). `rawRows` must be ordered by timestamp ASC.
 */
function computeET0Series(
  rawRows: any[],
  lat: number,
): { et0: number[]; rain: number[] } {
  const n = rawRows.length;
  const et0 = new Array<number>(n).fill(0);
  const rain = new Array<number>(n).fill(0);

  // --- rain increments (cumulative dailyrain counter -> per-sample delta) ---
  let prevRain: number | null = null;
  let prevDay: string | null = null;
  for (let i = 0; i < n; i += 1) {
    const row = rawRows[i];
    const cur = row.dailyrain != null ? Number(row.dailyrain) : null;
    const key = dayKey(new Date(row.timestamp));
    if (cur != null) {
      let inc: number;
      if (prevRain == null || key !== prevDay || cur < prevRain) {
        inc = Math.max(0, cur);
      } else {
        inc = Math.max(0, cur - prevRain);
      }
      rain[i] = inc;
      prevRain = cur;
      prevDay = key;
    }
  }

  // --- ET0, grouped by local day (Hargreaves requires a full day's Tmax/Tmin) ---
  const dayGroups = new Map<string, number[]>();
  for (let i = 0; i < n; i += 1) {
    const key = dayKey(new Date(rawRows[i].timestamp));
    let list = dayGroups.get(key);
    if (!list) {
      list = [];
      dayGroups.set(key, list);
    }
    list.push(i);
  }

  for (const idxs of dayGroups.values()) {
    let validSolarWindCount = 0;
    const temps: number[] = [];
    for (const idx of idxs) {
      const row = rawRows[idx];
      const temp = row.temp != null ? Number(row.temp) : null;
      const solar = row.solarradiation != null ? Number(row.solarradiation) : null;
      const wind = row.windspeed != null ? Number(row.windspeed) : null;
      if (temp != null) temps.push(temp);
      if (solar != null && wind != null) validSolarWindCount += 1;
    }

    const dayOfYear = getDayOfYear(new Date(rawRows[idxs[0]].timestamp));

    if (validSolarWindCount < 5) {
      if (temps.length >= 2) {
        const tmax = Math.max(...temps);
        const tmin = Math.min(...temps);
        const dailyET0 = calculateHargreavesET0(tmin, tmax, lat, dayOfYear);

        let totalDt = 0;
        const dts: number[] = [];
        for (let k = 0; k < idxs.length; k += 1) {
          const idxCurr = idxs[k];
          const idxPrev = k > 0 ? idxs[k - 1] : idxs[k] > 0 ? idxs[k] - 1 : idxCurr;
          const dt = clampDt(
            (new Date(rawRows[idxCurr].timestamp).getTime()
              - new Date(rawRows[idxPrev].timestamp).getTime()) / 86400000,
          );
          dts.push(dt);
          totalDt += dt;
        }
        for (let k = 0; k < idxs.length; k += 1) {
          const share = totalDt > 0 ? dts[k] / totalDt : 1 / idxs.length;
          et0[idxs[k]] = dailyET0 * share;
        }
      }
    } else {
      for (let k = 0; k < idxs.length; k += 1) {
        const idxCurr = idxs[k];
        const idxPrev = k > 0 ? idxs[k - 1] : idxs[k] > 0 ? idxs[k] - 1 : idxCurr;
        const dt = clampDt(
          (new Date(rawRows[idxCurr].timestamp).getTime()
            - new Date(rawRows[idxPrev].timestamp).getTime()) / 86400000,
        );

        const row = rawRows[idxCurr];
        const temp = row.temp != null ? Number(row.temp) : null;
        const humidity = row.humidity != null ? Number(row.humidity) : null;
        const wind = row.windspeed != null ? Number(row.windspeed) : null;
        const solar = row.solarradiation != null ? Number(row.solarradiation) : null;
        const pressure = row.pressurerel != null
          ? Number(row.pressurerel)
          : row.pressureabs != null ? Number(row.pressureabs) : null;

        const sampleDayOfYear = getDayOfYear(new Date(row.timestamp));
        const et0Rate = calculatePenmanMonteithInstantaneousET0(
          temp,
          humidity,
          wind,
          solar,
          pressure,
          lat,
          sampleDayOfYear,
        );
        if (et0Rate != null) {
          et0[idxCurr] = et0Rate * dt;
        }
      }
    }
  }

  return { et0, rain };
}

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
  if (!/^[a-z0-9_:]+$/i.test(measurement) || measurement.length > 64) {
    throw new Error(`Invalid measurement: ${measurement}`);
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

    if (!/^[a-z0-9_]+$/i.test(column) || column.length > 64) {
      throw new Error(`Invalid column: ${column}`);
    }
    if (extraColumn !== "" && (!/^[a-z0-9_]+$/i.test(extraColumn) || extraColumn.length > 64)) {
      throw new Error(`Invalid extraColumn: ${extraColumn}`);
    }

    if (!checkInput(stationID, column, extraColumn, allStationsCfg)) {
      console.error("Wrong input", stationID, column, extraColumn);
      return null;
    }

    const table = `station_${stationID}`;

    if (column === "et0") {
      const station = allStationsCfg.getStationByID(stationID);
      const lat = station ? station.lat : DEFAULT_LAT;

      const resRaw = await client.query(
        `SELECT timestamp, temp, humidity, windspeed, solarradiation, pressurerel, pressureabs, dailyrain
         FROM "${table}"
         WHERE timestamp >= $1 AND timestamp < $2
         ORDER BY timestamp ASC`,
        [timestampStart, timestampEnd],
      );

      const rawRows = resRaw.rows;
      const intervalMs = interval * 60 * 1000;
      const buckets: Array<{ timestamp: number; et0Sum: number; rainSum: number; count: number }> = [];
      let tBucket = start.getTime();
      while (tBucket <= end.getTime()) {
        buckets.push({
          timestamp: tBucket,
          et0Sum: 0,
          rainSum: 0,
          count: 0,
        });
        tBucket += intervalMs;
      }

      const { et0: et0PerRow, rain: rainPerRow } = computeET0Series(rawRows, lat);

      rawRows.forEach((row: any, idx: number) => {
        const tRow = new Date(row.timestamp).getTime();
        const bucketIdx = Math.floor((tRow - start.getTime()) / intervalMs);
        if (bucketIdx >= 0 && bucketIdx < buckets.length) {
          buckets[bucketIdx].et0Sum += et0PerRow[idx];
          buckets[bucketIdx].rainSum += rainPerRow[idx];
          buckets[bucketIdx].count += 1;
        }
      });

      let statsMin: number | null = null;
      let statsMax: number | null = null;
      let statsSum = 0;
      let statsRain = 0;
      let validBuckets = 0;

      buckets.forEach((b) => {
        const et0Sum = Number(b.et0Sum.toFixed(2));
        statsRain += b.rainSum;
        if (b.count > 0) {
          if (statsMin === null || et0Sum < statsMin) statsMin = et0Sum;
          if (statsMax === null || et0Sum > statsMax) statsMax = et0Sum;
          statsSum += et0Sum;
          validBuckets += 1;
        }
      });

      const statsAvg = validBuckets > 0 ? statsSum / validBuckets : 0;

      const responseData = buckets.map((b, i) => {
        const et0Sum = Number(b.et0Sum.toFixed(2));
        return {
          grp: i + 1,
          timestamp: b.timestamp,
          min: et0Sum,
          max: et0Sum,
          rain: Number(b.rainSum.toFixed(1)),
        };
      });

      return {
        stats: {
          min: statsMin ?? 0,
          max: statsMax ?? 0,
          avg: Number(statsAvg.toFixed(2)),
          sum: Number(statsSum.toFixed(1)),
          rain: Number(statsRain.toFixed(1)),
          first: responseData[0]?.min ?? 0,
          last: responseData[responseData.length - 1]?.min ?? 0,
        },
        data: responseData,
      };
    }

    const [resData, resStats] = await Promise.all([
      client.query(
        `WITH intervals AS (
          SELECT gs AS start, gs + $1::text::interval AS end, ROW_NUMBER() OVER () AS grp
          FROM generate_series ($2::timestamptz, $3::timestamptz, $1::text::interval) gs
        ), create_grp AS (
          SELECT i.grp, i.start, i.end, s."${column}", s.timestamp
          FROM "${table}" s
          RIGHT JOIN intervals i
            ON s.timestamp >= i.start AND s.timestamp < i.end
        )
        SELECT grp, EXTRACT(EPOCH FROM start) * 1000 AS timestamp, min("${column}"), max("${column}")
        FROM create_grp
        GROUP BY grp, start
        ORDER BY grp`,
        [`${interval} minutes`, timestampStart, timestampEnd],
      ),
      client.query(
        `SELECT
           min("${column}") AS min,
           max("${column}") AS max,
           avg("${column}") AS avg,
           (SELECT "${column}" FROM "${table}" WHERE timestamp >= $1 AND timestamp < $2 ORDER BY timestamp ASC  LIMIT 1) AS first,
           (SELECT "${column}" FROM "${table}" WHERE timestamp >= $1 AND timestamp < $2 ORDER BY timestamp DESC LIMIT 1) AS last
         FROM "${table}"
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
    throw e;
  } finally {
    client.release();
  }
}

export async function loadDailyET0(
  stationID: string,
  allStationsCfg: AllStationsCfg,
): Promise<{ et0: number; rain: number } | null> {
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(stationID) || stationID.length > 64) {
    throw new Error(`Invalid stationID: ${stationID}`);
  }
  const station = allStationsCfg.getStationByID(stationID);
  if (station == null) return null;
  const {lat} = station;

  const end = new Date();
  const start = new Date(end.getTime() - 24 * 3600000);
  const timestampStart = `${start.toISOString().slice(0, 19).replace("T", " ")}+00`;
  const timestampEnd = `${end.toISOString().slice(0, 19).replace("T", " ")}+00`;

  const client = await pool.connect();
  try {
    const table = `station_${stationID}`;
    const resRaw = await client.query(
      `SELECT timestamp, temp, humidity, windspeed, solarradiation, pressurerel, pressureabs, dailyrain
       FROM "${table}"
       WHERE timestamp >= $1 AND timestamp < $2
       ORDER BY timestamp ASC`,
      [timestampStart, timestampEnd],
    );

    const { et0, rain } = computeET0Series(resRaw.rows, lat);
    const et0Sum = et0.reduce((acc, v) => acc + v, 0);
    const rainSum = rain.reduce((acc, v) => acc + v, 0);
    return { et0: round(et0Sum, 1), rain: round(rainSum, 1) };
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    client.release();
  }
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
        FROM "${table}"
        WHERE timestamp > current_timestamp - '4 weeks'::interval
        GROUP BY DATE_TRUNC('hour', timestamp)
      ),
      minuterain AS (
        SELECT s.timestamp, s.rainrate * h.coef AS rain
        FROM "${table}" s
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
    throw e;
  } finally {
    client.release();
  }
}

function getQuery(id: string, entries: [string, any][]) {
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(id) || id.length > 64) {
    throw new Error(`Invalid station ID: ${id}`);
  }
  let qtext = `insert into "station_${id}" (`;
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
        if (!/^[a-z0-9_]+$/i.test(sensor) || sensor.length > 64) {
          throw new Error(`Invalid sensor column name: ${sensor}`);
        }
        qtext += `"${sensor}",`;
        qtextv += `$${i},`;
        if (sensor !== "timestamp") {
          qtextu += `"${sensor}" = EXCLUDED."${sensor}",`;
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
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(id) || id.length > 64) {
    throw new Error(`Invalid station ID: ${id}`);
  }
  const dbclient = await pool.connect();
  try {
    await dbclient.query("BEGIN");
    await dbclient.query(`CREATE TABLE public."station_${id}" (
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
    await dbclient.query(`ALTER TABLE public."station_${id}" OWNER TO postgres`);
    await dbclient.query(
      `ALTER TABLE ONLY public."station_${id}" ADD CONSTRAINT "station_${id}_pkey" PRIMARY KEY ("timestamp")`,
    );
    await dbclient.query("COMMIT");
  } catch (e) {
    await dbclient.query("ROLLBACK");
    console.error(e);
  } finally {
    dbclient.release();
  }
}
