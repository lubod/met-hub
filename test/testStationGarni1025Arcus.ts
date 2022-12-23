import assert from "assert";
import axios from "axios";
import fetch from "node-fetch";
import { Pool } from "pg";
import StationCtrl from "../client/station/stationCtrl";
import MySocket from "../client/socket";
import {
  IStationData,
  IStationGarni1025ArcusDataRaw,
} from "../common/stationModel";
import { AllStationsCfg } from "../common/allStationsCfg";
import StationGarni1025Arcus from "../server/stationGarni1025Arcus";

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
  const data = {} as IStationGarni1025ArcusDataRaw;
  data.ID = PASSKEY;
  data.PASSWORD = "";
  data.action = "updateraww";
  data.realtime = "1";
  data.rtfreq = 5;
  data.dateutc = "now";
  data.baromin = round(random(25, 35), 3);
  data.tempf = round(random(60, 80), 1);
  data.dewptf = round(random(60, 80), 1);
  data.humidity = round(random(40, 60), 0);
  data.windspeedmph = round(random(0, 50), 1);
  data.windgustmph = round(random(data.windspeedmph, 60), 1);
  data.winddir = round(random(0, 359), 0);
  data.rainin = round(random(0, 1), 3);
  data.dailyrainin = round(random(0, 1), 3);
  data.solarradiation = round(random(0, 1000), 2);
  data.UV = round(data.solarradiation / 100, 0);
  data.indoortempf = round(random(60, 80), 1);
  data.indoorhumidity = round(random(40, 60), 0);
  return data;
}

function generateOffsetData(
  cdata: IStationGarni1025ArcusDataRaw,
  offset: number
) {
  const data = {} as IStationGarni1025ArcusDataRaw;
  data.ID = cdata.ID;
  data.PASSWORD = cdata.PASSWORD;
  data.action = cdata.action;
  data.realtime = cdata.realtime;
  data.rtfreq = cdata.rtfreq;
  data.dateutc = cdata.dateutc;
  data.baromin = round(cdata.baromin + offset, 3);
  data.tempf = round(cdata.tempf + offset, 1);
  data.dewptf = round(cdata.tempf + offset, 1);
  data.humidity = round(cdata.humidity + offset, 0);
  data.windspeedmph = round(cdata.windspeedmph + offset, 1);
  data.windgustmph = round(cdata.windgustmph + offset, 1);
  data.winddir = round((cdata.winddir + offset) % 360, 0);
  data.rainin = cdata.rainin;
  data.dailyrainin = cdata.dailyrainin;
  data.solarradiation = round(cdata.solarradiation + offset, 2);
  data.UV = round(cdata.solarradiation / 100, 0);
  data.indoortempf = round(cdata.indoortempf + offset, 1);
  data.indoorhumidity = round(cdata.indoorhumidity + offset, 0);
  return data;
}

/*
     {
   ID: '',
   PASSWORD: '',
   action: 'updateraww',
   realtime: '1',
   rtfreq: '5',
   dateutc: 'now',
   baromin: '29.94',
   tempf: '73.5',
   dewptf: '63.5',
   humidity: '71',
   windspeedmph: '0.0',
   windgustmph: '0.0',
   winddir: '6',
   rainin: '0.0',
   dailyrainin: '0.0',
   solarradiation: '0.39',
   UV: '0.0',
   indoortempf: '72.8',
   indoorhumidity: '69'
 }
*/
// curl -X GET "localhost:8082/ID=&PASSWORD=&action=updateraww&realtime=1&rtfreq=5&dateutc=now&baromin=29.92&tempf=73.4&dewptf=62.9&humidity=70&windspeedmph=0.0&windgustmph=0.0&winddir=306&rainin=0.0&dailyrainin=0.0&solarradiation=0.31&UV=0.0&indoortempf=72.5&indoorhumidity=68weatherstation/updateweatherstation.php?"

async function postData(data: any) {
  try {
    await axios.get(
      `http://localhost:18080/weatherstation/updateweatherstation.php?ID=${data.ID}&PASSWORD=${data.PASSWORD}&action=${data.action}&realtime=${data.realtime}&rtfreq=${data.rtfreq}&dateutc=${data.dateutc}&baromin=${data.baromin}&tempf=${data.tempf}&dewptf=${data.dewptf}&humidity=${data.humidity}&windspeedmph=${data.windspeedmph}&windgustmph=${data.windgustmph}&winddir=${data.winddir}&rainin=${data.rainin}&dailyrainin=${data.dailyrainin}&solarradiation=${data.solarradiation}&UV=${data.UV}&indoortempf=${data.indoortempf}&indoorhumidity=${data.indoorhumidity}`
    );
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
  const station = new StationGarni1025Arcus(STATION_ID);

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

  // data1.dateutc = `${pgtime}:${d.getUTCSeconds()}`;
  // data2.dateutc = `${pgtime}:${d.getUTCSeconds() + 1}`;
  // data3.dateutc = `${pgtime}:${d.getUTCSeconds() + 2}`;

  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data1.dateutc, pgtime);
  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data2.dateutc, pgtime);
  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data3.dateutc, pgtime);

  const { decoded } = station.decodeData(data1);

  const pgData = {
    dailyrain: decoded.dailyrain.toFixed(1),
    humidity: decoded.humidity.toFixed(0),
    humidityin: decoded.humidityin.toFixed(0),
    pressurerel: decoded.pressurerel.toFixed(1),
    rainrate: decoded.rainrate.toFixed(1),
    solarradiation: decoded.solarradiation.toFixed(1),
    temp: decoded.temp.toFixed(1),
    tempin: decoded.tempin.toFixed(1),
    timestamp: new Date(`${decoded.timestamp.substr(0, 17)}00.000Z`),
    uv: decoded.uv.toFixed(0),
    winddir: decoded.winddir.toFixed(0),
    windgust: decoded.windgust.toFixed(1),
    windspeed: decoded.windspeed.toFixed(1),
    eventrain: decoded.eventrain,
    hourlyrain: decoded.hourlyrain,
    weeklyrain: decoded.weeklyrain,
    monthlyrain: decoded.monthlyrain,
    pressureabs: decoded.pressureabs,
  };

  const socket = new MySocket();
  const stationCtrl = new StationCtrl(socket, STATION_ID, null); // todo
  stationCtrl.start();

  setTimeout(() => postData(data1), 500);
  setTimeout(async () => {
    const sd = await fetchStationData(STATION_ID);
    const expected = station.decodeData(data1).decoded;
    expected.timestamp = sd.timestamp; // now
    assert.deepStrictEqual(sd, expected);
    console.info("Redis1 OK");
    const actual = getClientStationData(stationCtrl.stationData.data);
    assert.deepStrictEqual(actual, expected);
    console.info("Client1 OK");
  }, 1000);
  setTimeout(() => postData(data2), 1500);
  setTimeout(async () => {
    const sd = await fetchStationData(STATION_ID);
    const expected = station.decodeData(data2).decoded;
    expected.timestamp = sd.timestamp; // now
    assert.deepStrictEqual(sd, expected);
    console.info("Redis2 OK");
    const actual = getClientStationData(stationCtrl.stationData.data);
    assert.deepStrictEqual(actual, expected);
    console.info("Client2 OK");
  }, 2000);
  setTimeout(() => postData(data3), 2500);
  setTimeout(async () => {
    const sd = await fetchStationData(STATION_ID);
    const expected = station.decodeData(data3).decoded;
    expected.timestamp = sd.timestamp; // now
    assert.deepStrictEqual(sd, expected);
    console.info("Redis3 OK");
    const actual = getClientStationData(stationCtrl.stationData.data);
    assert.deepStrictEqual(actual, expected);
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
  const STATION_ID = allStationsCfg.getSecondDefaultStationID(); // todo
  const PASSKEY = allStationsCfg.getStationByID(STATION_ID).passkey;
  main(STATION_ID, PASSKEY);
});
