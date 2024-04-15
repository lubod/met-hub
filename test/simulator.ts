import { Pool } from "pg";
import { IDomData } from "../common/domModel";
import { IStationData } from "../common/stationModel";

const PG_PORT = parseInt(process.env.PG_PORT, 10) || 5432;
const PG_PASSWORD = process.env.PG_PASSWORD || "postgres";
const PG_DB = process.env.PG_DB || "postgres";
const PG_HOST = process.env.PG_HOST || "192.168.1.199";
const PG_USER = process.env.PG_USER || "postgres";

// eslint-disable-next-line import/prefer-default-export
export abstract class CSimulator {
  // eslint-disable-next-line no-unused-vars
  abstract generateData(d: Date, PASSKEY: string): any;

  // eslint-disable-next-line no-unused-vars
  abstract generateOffsetData(cdata: any, offset: number): any;

  // eslint-disable-next-line no-unused-vars
  abstract getClientStationData(data: any): any;

  // eslint-disable-next-line no-unused-vars
  abstract getPGData(decoded: any): any;

  // eslint-disable-next-line no-unused-vars
  abstract postData(data: any): any;

  // eslint-disable-next-line no-unused-vars
  abstract correctTimestamp(decoded: IDomData | IStationData, sd: any): any;

  async fetchStationData(STATION_ID: string) {
    const url = `http://localhost:18080/api/getLastData/station/${STATION_ID}`;
    console.info("GET", url);

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 401) {
        console.error("auth 401");
      } else {
        const json = await res.json();
        json.timestamp = new Date(json.timestamp);
        return json;
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async loadStationData(time: string, STATION_ID: string) {
    const pool = new Pool({
      user: PG_USER,
      host: PG_HOST,
      database: PG_DB,
      password: PG_PASSWORD,
      port: PG_PORT,
    });

    const client = await pool.connect();
    try {
      console.info(`PG: ${PG_HOST}`);
      console.info("connected", new Date());

      const table = `station_${STATION_ID}`;
      const queryText = `select * from ${table} where timestamp='${time}:00+00'`;
      const res = await client.query(queryText);
      //    console.log('rows', queryText, res.rows[0]);
      return res.rows[0];
    } catch (e) {
      console.error(e);
    } finally {
      client.release();
      console.info("released");
    }
    return null;
  }
}
