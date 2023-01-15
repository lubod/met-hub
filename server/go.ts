/* eslint-disable camelcase */
import { Pool } from "pg";
import { getForecast } from "./forecast";

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

export default class go {
  async store(id: string, forecast: any) {
    const client = await pool.connect();
    const lat = forecast.geometry.coordinates[0];
    const lon = forecast.geometry.coordinates[1];
    const updated = forecast.properties.meta.updated_at;
    const { timeseries } = forecast.properties;
    try {
      console.info(`connected`, forecast);
      await client.query("BEGIN");
      for (const timeserie of timeseries) {
        const { time } = timeserie;
        const {
          air_pressure_at_sea_level,
          air_temperature,
          cloud_area_fraction,
          cloud_area_fraction_high,
          cloud_area_fraction_low,
          cloud_area_fraction_medium,
          dew_point_temperature,
          fog_area_fraction,
          relative_humidity,
          ultraviolet_index_clear_sky,
          wind_from_direction,
          wind_speed,
        } = timeserie.data.instant.details;
        let precipitation_amount;
        if (timeserie.data.next_1_hours != null) {
          precipitation_amount =
            timeserie.data.next_1_hours.details.precipitation_amount;
        } else if (timeserie.data.next_6_hours != null) {
          precipitation_amount =
            timeserie.data.next_6_hours.details.precipitation_amount;
        }
        const queryText = `INSERT INTO forecasts(updated, lat, lon, time, air_pressure_at_sea_level, air_temperature, cloud_area_fraction, cloud_area_fraction_high, cloud_area_fraction_low, cloud_area_fraction_medium, dew_point_temperature, fog_area_fraction, relative_humidity, ultraviolet_index_clear_sky, wind_from_direction, wind_speed, precipitation_amount, id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) ON CONFLICT (updated, time, lat, lon) DO NOTHING;`;
        const queryArray = [
          updated,
          lat,
          lon,
          time,
          air_pressure_at_sea_level,
          air_temperature,
          cloud_area_fraction,
          cloud_area_fraction_high,
          cloud_area_fraction_low,
          cloud_area_fraction_medium,
          dew_point_temperature,
          fog_area_fraction,
          relative_humidity,
          ultraviolet_index_clear_sky,
          wind_from_direction,
          wind_speed,
          precipitation_amount,
          id,
        ];
        client.query(queryText, queryArray);
        console.info(queryText);
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
      console.info("released");
    }
  }

  async getForecasts(lat: string, lon: string) {
    const forecast = await getForecast(lat, lon);
    return forecast;
  }

  async start() {
    const resorts = [
      {
        id: "jasna",
        lat: "48.9707",
        lon: "19.5811",
      },
      {
        id: "lomnica",
        lat: "49.167094",
        lon: "20.269726",
      },
      {
        id: "lomnica start",
        lat: "49.180673",
        lon: "20.255993",
      },
      {
        id: "lomnica cucoriedky",
        lat: "49.183058",
        lon: "20.245908",
      },
      {
        id: "lomnica skalnate pleso",
        lat: "49.187125",
        lon: "20.232261",
      },
      {
        id: "lomnica sedlo",
        lat: "49.190912",
        lon: "20.217197",
      },
    ];
    try {
      for (const resort of resorts) {
        // eslint-disable-next-line no-await-in-loop
        const forecast = await this.getForecasts(resort.lat, resort.lon);
        this.store(resort.id, forecast);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export async function goSelect(
  air_temperature_min: number,
  air_temperature_max: number,
  cloud_area_fraction_min: number,
  cloud_area_fraction_max: number,
  fog_area_fraction_min: number,
  fog_area_fraction_max: number,
  wind_speed_min: number,
  wind_speed_max: number,
  hour_min: number,
  hour_max: number,
  precipitation_amount_min: number,
  precipitation_amount_max: number
) {
  const client = await pool.connect();
  try {
    console.info("connected", new Date());
    const table = `forecasts`;
    const queryText = `select * from ${table} where time > now() and air_temperature <= ${air_temperature_max} and air_temperature >= ${air_temperature_min} and cloud_area_fraction <= ${cloud_area_fraction_max} and cloud_area_fraction >= ${cloud_area_fraction_min} and (fog_area_fraction <= ${fog_area_fraction_max} and fog_area_fraction >= ${fog_area_fraction_min} or fog_area_fraction is null) and wind_speed <= ${wind_speed_max} and wind_speed >= ${wind_speed_min} and extract(hour from time) >= ${hour_min} and extract(hour from time) < ${hour_max} and (precipitation_amount >= ${precipitation_amount_min} and precipitation_amount <= ${precipitation_amount_max} or precipitation_amount is null)`;
    const res = await client.query(queryText);
    // console.log("rows", queryText, typeof res.rows, res.fields);
    return res.rows;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    console.info("released");
  }
  return null;
}

/*
const duckdb = require("duckdb");

export default class Go {
  db: any;

  constructor() {
    console.info("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
    this.db = new duckdb.Database(":memory:"); // or a file name for a persistent DB
  }

  start() {
    try {
      this.getForecasts();
      this.create();
      // this.select();
    } catch (e) {
      console.error(e);
    }
  }

  async getForecasts() {
    const jasna = await getForecast("48.9707", "19.5811");
    console.log(jasna);
  }

  create() {
    const con = this.db.connect();
    con.run("CREATE TABLE a (i INTEGER)");
    const stmt = con.prepare("INSERT INTO a VALUES (?)");
    for (let i = 0; i < 10; i += 1) {
      stmt.run(i);
    }
    stmt.finalize();
    con.all("SELECT * FROM a", (err: any, res: any) => {
      if (err) {
        throw err;
      }
      console.log(res);
    });
  }

  select() {
    this.db.all("SELECT 42 AS fortytwo", (err: any, res: any) => {
      if (err) {
        throw err;
      }
      console.log(res);
    });
  }
}
*/
