import assert from "assert";
import axios from "axios";
import fetch from "node-fetch";
import { Pool } from "pg";
import StationCtrl from "../client/station/stationCtrl";
import MySocket from "../client/socket";
import {
  IStationData,
  IStationGoGenMe3900DataRaw,
} from "../common/stationModel";
import StationGoGenMe3900 from "../server/stationGoGenMe3900";
import { AllStationsCfg } from "../common/allStationsCfg";

const PG_PORT = parseInt(process.env.PG_PORT, 10) || 15432;
const PG_PASSWORD = process.env.PG_PASSWORD || "postgres";
const PG_DB = process.env.PG_DB || "postgres";
const PG_HOST = process.env.PG_HOST || "192.168.1.199";
const PG_USER = process.env.PG_USER || "postgres";

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function round(value: number, precision: number) {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function generateData(d: Date, PASSKEY: string) {
  d.setUTCMilliseconds(0);
  const data = {} as IStationGoGenMe3900DataRaw;
  data.PASSKEY = PASSKEY;
  data.stationtype = "EasyWeatherV1.5.2";
  data.wh65batt = 0;
  data.freq = "868M";
  data.model = "WS2900_V2.01.10";
  data.dateutc = d.toISOString().replace("T", " ").replace(".000Z", "");
  data.tempinf = round(random(60, 80), 1);
  data.humidityin = round(random(40, 60), 0);
  data.baromrelin = round(random(25, 35), 3);
  data.baromabsin = round(random(25, 35), 3);
  data.tempf = round(random(60, 80), 1);
  data.humidity = round(random(40, 60), 0);
  data.winddir = round(random(0, 359), 0);
  data.windspeedmph = round(random(0, 50), 1);
  data.windgustmph = round(random(data.windspeedmph, 60), 1);
  data.maxdailygust = round(random(data.windgustmph, 70), 1);
  data.rainratein = round(random(0, 1), 3);
  data.eventrainin = round(random(0, 0.5), 3);
  data.hourlyrainin = round(random(data.eventrainin, 0.7), 3);
  data.dailyrainin = round(random(data.hourlyrainin, 1), 3);
  data.weeklyrainin = round(random(data.dailyrainin, 1.4), 3);
  data.monthlyrainin = round(random(data.weeklyrainin, 1.8), 3);
  data.totalrainin = round(random(data.monthlyrainin, 10), 3);
  data.solarradiation = round(random(0, 1000), 2);
  data.uv = round(data.solarradiation / 100, 0);
  return data;
}

function generateOffsetData(cdata: IStationGoGenMe3900DataRaw, offset: number) {
  const data = {} as IStationGoGenMe3900DataRaw;
  data.PASSKEY = cdata.PASSKEY;
  data.stationtype = cdata.stationtype;
  data.wh65batt = cdata.wh65batt;
  data.freq = cdata.freq;
  data.model = cdata.model;
  data.dateutc = cdata.dateutc;
  data.tempinf = round(cdata.tempinf + offset, 1);
  data.humidityin = round(cdata.humidityin + offset, 0);
  data.baromrelin = round(cdata.baromrelin + offset, 3);
  data.baromabsin = round(cdata.baromabsin + offset, 3);
  data.tempf = round(cdata.tempf + offset, 1);
  data.humidity = round(cdata.humidity + offset, 0);
  data.winddir = round((cdata.winddir + offset) % 360, 0);
  data.windspeedmph = round(cdata.windspeedmph + offset, 1);
  data.windgustmph = round(cdata.windgustmph + offset, 1);
  data.maxdailygust = cdata.maxdailygust;
  data.rainratein = cdata.rainratein;
  data.eventrainin = cdata.eventrainin;
  data.hourlyrainin = cdata.hourlyrainin;
  data.dailyrainin = cdata.dailyrainin;
  data.weeklyrainin = cdata.weeklyrainin;
  data.monthlyrainin = cdata.monthlyrainin;
  data.totalrainin = cdata.totalrainin;
  data.solarradiation = round(cdata.solarradiation + offset, 2);
  data.uv = round(cdata.solarradiation / 100, 0);
  return data;
}

/*
{
  PASSKEY: '',
  stationtype: 'EasyWeatherV1.5.2',
  dateutc: '2021-04-06 08:42:00',
  tempinf: '74.1',
  humidityin: '62',
  baromrelin: '30.189',
  baromabsin: '29.442',
  tempf: '71.4',
  humidity: '72',
  winddir: '69',
  windspeedmph: '0.4',
  windgustmph: '1.1',
  maxdailygust: '3.4',
  rainratein: '0.000',
  eventrainin: '0.000',
  hourlyrainin: '0.000',
  dailyrainin: '0.000',
  weeklyrainin: '0.000',
  monthlyrainin: '0.201',
  totalrainin: '0.201',
  solarradiation: '19.45',
  uv: '0',
  wh65batt: '0',
  freq: '868M',
  model: 'WS2900_V2.01.10',
};
*/

async function postData(data: any) {
  try {
    await axios.post("http://localhost:18080/setData", data, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function fetchStationData(STATION_ID: string) {
  const url = `http://localhost:18080/api/getLastData/station/${STATION_ID}`;
  console.info("GET", url);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: "Bearer 1",
      },
    });
    if (res.status === 401) {
      console.error("auth 401");
    } else {
      const json = await res.json();
      return json;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

async function loadStationData(time: string, STATION_ID: string) {
  const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DB,
    password: PG_PASSWORD,
    port: PG_PORT,
  });

  const client = await pool.connect();
  try {
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

function getClientStationData(data: IStationData) {
  const csd: IStationData = {
    timestamp: data.timestamp,
    place: data.place,
    tempin: data.tempin,
    humidityin: data.humidityin,
    temp: data.temp,
    humidity: data.humidity,
    pressurerel: data.pressurerel,
    pressureabs: data.pressureabs,
    windgust: data.windgust,
    windspeed: data.windspeed,
    winddir: data.winddir,
    maxdailygust: data.maxdailygust,
    solarradiation: data.solarradiation,
    uv: data.uv,
    rainrate: data.rainrate,
    eventrain: data.eventrain,
    hourlyrain: data.hourlyrain,
    dailyrain: data.dailyrain,
    weeklyrain: data.weeklyrain,
    monthlyrain: data.monthlyrain,
    totalrain: data.totalrain,
    minuterain: data.minuterain,
  };
  return csd;
}

function main(STATION_ID: string, PASSKEY: string) {
  const station = new StationGoGenMe3900(STATION_ID);

  console.info(`PG: ${PG_HOST}`);

  const data1 = generateData(new Date(), PASSKEY);
  const data2 = generateOffsetData(data1, 5);
  const data3 = generateOffsetData(data1, -5);
  // console.info(data1);
  // console.info(data2);
  // console.info(data3);
  // console.log(decodedData1);

  const d = new Date();
  d.setUTCMilliseconds(0);
  const pgtime = `${d.getUTCFullYear()}-${
    d.getUTCMonth() + 1
  }-${d.getUTCDate()} ${d.getUTCHours()}:${d.getUTCMinutes()}`;

  const toMinute = Date.now() % 60000;

  data1.dateutc = `${pgtime}:${d.getUTCSeconds()}`;
  data2.dateutc = `${pgtime}:${d.getUTCSeconds() + 1}`;
  data3.dateutc = `${pgtime}:${d.getUTCSeconds() + 2}`;

  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data1.dateutc, pgtime);
  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data2.dateutc, pgtime);
  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data3.dateutc, pgtime);

  const { decoded } = station.decodeData(data1);

  const pgData = {
    eventrain: decoded.eventrain.toFixed(1),
    hourlyrain: decoded.hourlyrain.toFixed(1),
    dailyrain: decoded.dailyrain.toFixed(1),
    weeklyrain: decoded.weeklyrain.toFixed(1),
    monthlyrain: decoded.monthlyrain.toFixed(1),
    humidity: decoded.humidity.toFixed(0),
    humidityin: decoded.humidityin.toFixed(0),
    pressureabs: decoded.pressureabs.toFixed(1),
    pressurerel: decoded.pressurerel.toFixed(1),
    rainrate: decoded.rainrate.toFixed(1),
    solarradiation: decoded.solarradiation.toFixed(1),
    temp: decoded.temp.toFixed(1),
    tempin: decoded.tempin.toFixed(1),
    timestamp: new Date(
      `${decoded.timestamp.substr(0, 17)}00${decoded.timestamp.substr(19)}`
    ),
    uv: decoded.uv.toFixed(0),
    winddir: decoded.winddir.toFixed(0),
    windgust: decoded.windgust.toFixed(1),
    windspeed: decoded.windspeed.toFixed(1),
  };

  const socket = new MySocket();
  const stationCtrl = new StationCtrl(socket, STATION_ID, null); // todo
  stationCtrl.start();

  postData(data1);
  setTimeout(async () => {
    const sd = await fetchStationData(STATION_ID);
    assert.deepStrictEqual(sd, station.decodeData(data1).decoded);
    console.info("Redis1 OK");
    assert.deepStrictEqual(
      getClientStationData(stationCtrl.stationData.data),
      station.decodeData(data1).decoded
    );
    console.info("Client1 OK");
  }, 1000);
  setTimeout(() => postData(data2), 1500);
  setTimeout(async () => {
    const sd = await fetchStationData(STATION_ID);
    assert.deepStrictEqual(sd, station.decodeData(data2).decoded);
    console.info("Redis2 OK");
    assert.deepStrictEqual(
      getClientStationData(stationCtrl.stationData.data),
      station.decodeData(data2).decoded
    );
    console.info("Client2 OK");
  }, 2000);
  setTimeout(() => postData(data3), 2500);
  setTimeout(async () => {
    const sd = await fetchStationData(STATION_ID);
    assert.deepStrictEqual(sd, station.decodeData(data3).decoded);
    console.info("Redis3 OK");
    assert.deepStrictEqual(
      getClientStationData(stationCtrl.stationData.data),
      station.decodeData(data3).decoded
    );
    console.info("Client3 OK");
  }, 3000);
  setTimeout(async () => {
    const rows = await loadStationData(pgtime, STATION_ID);
    assert.deepStrictEqual(rows, pgData);
    console.info("PG OK");
  }, 61000 - toMinute);
}

const allStationsCfg = new AllStationsCfg();
allStationsCfg.readCfg().then(() => {
  const STATION_ID = allStationsCfg.getDefaultStationID(); // todo
  const PASSKEY = allStationsCfg.getStationByID(STATION_ID).passkey;
  main(STATION_ID, PASSKEY);
});
