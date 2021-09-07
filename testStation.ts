import assert from 'assert';
import axios from 'axios';
import fetch from 'node-fetch';
import { Pool } from 'pg';
import { IStationData, IStationDataRaw } from './client/models/stationModel';

const PG_PORT = parseInt(process.env.PG_PORT) || 15432;
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres';
const PG_DB = process.env.PG_DB || 'postgres';
const PG_HOST = process.env.PG_HOST || '192.168.1.199';
const PG_USER = process.env.PG_USER || 'postgres';

console.info('PG: ' + PG_HOST);

process.env.STATION_PASSKEY = '33564A0851CC0C0D15FE3353FB8D8B47';

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function generateData(d: Date) {
  d.setUTCMilliseconds(0);
  const data = {} as IStationDataRaw;
  data.PASSKEY = '33564A0851CC0C0D15FE3353FB8D8B47';
  data.stationtype = 'EasyWeatherV1.5.2';
  data.wh65batt = 0;
  data.freq = '868M';
  data.model = 'WS2900_V2.01.10';
  data.dateutc = d.toISOString().replace('T', ' ').replace('.000Z', '');
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

function generateOffsetData(cdata: IStationDataRaw, offset: number) {
  const data = {} as IStationDataRaw;
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
  PASSKEY: '33564A0851CC0C0D15FE3353FB8D8B47',
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
    await axios.post('http://localhost:8082/setData', data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function fetchStationData() {
  const url = 'http://localhost:8082/api/getLastData/station';
  console.info(url);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer 1`,
      },
    });
    if (res.status === 401) {
      console.error('auth 401');
    }
    else {
      const json = await res.json();
      return json;
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function loadStationData() {
  const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DB,
    password: PG_PASSWORD,
    port: PG_PORT,
  });

  const client = await pool.connect();
  try {
    console.info('connected', new Date());

    let table = 'stanica';
    let queryText = 'select * from ' + table + ' where timestamp=\'' + pgtime + ':00+00\'';
    let res = await client.query(queryText);
//    console.log('rows', queryText, res.rows[0]);
    return res.rows[0];
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    console.info('released');
  }
}

export function decodeStationData(data: IStationDataRaw) {
  const TO_MM = 25.4;
  const TO_KM = 1.6;
  const TO_HPA = 33.8639;

  //    console.log(data);
  const decoded: IStationData = {
    timestamp: new Date(data.dateutc + ' UTC').toISOString(),
    tempin: round((5 / 9) * (data.tempinf - 32), 1),
    pressurerel: round(data.baromrelin * TO_HPA, 1),
    pressureabs: round(data.baromabsin * TO_HPA, 1),
    temp: round((5 / 9) * (data.tempf - 32), 1),
    windspeed: round(data.windspeedmph * TO_KM, 1),
    windgust: round(data.windgustmph * TO_KM, 1),
    maxdailygust: round(data.maxdailygust * TO_KM, 1),
    rainrate: round(data.rainratein * TO_MM, 1),
    eventrain: round(data.eventrainin * TO_MM, 1),
    hourlyrain: round(data.hourlyrainin * TO_MM, 1),
    dailyrain: round(data.dailyrainin * TO_MM, 1),
    weeklyrain: round(data.weeklyrainin * TO_MM, 1),
    monthlyrain: round(data.monthlyrainin * TO_MM, 1),
    totalrain: round(data.totalrainin * TO_MM, 1),
    solarradiation: round(data.solarradiation * 1.0, 0),
    uv: round(data.uv * 1.0, 0),
    humidity: round(data.humidity * 1.0, 0),
    humidityin: round(data.humidityin * 1.0, 0),
    winddir: round(data.winddir * 1.0, 0),
    time: null,
    date: null,
    place: 'Marianka',
  };
  return decoded;
}

const data1 = generateData(new Date());
const data2 = generateOffsetData(data1, 5);
const data3 = generateOffsetData(data1, -5);
//console.info(data1);
//console.info(data2);
//console.info(data3);
//console.log(decodedData1);

const d = new Date();
d.setUTCMilliseconds(0);
const pgtime = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate() + ' ' + d.getUTCHours() + ':' + d.getUTCMinutes();

data1.dateutc = pgtime + ':' + d.getUTCSeconds();
data2.dateutc = pgtime + ':' + (d.getUTCSeconds() + 2);
data3.dateutc = pgtime + ':' + (d.getUTCSeconds() + 4);

console.info('Now, Timestamp, Redis, pgtime, Pg', d, data1.dateutc, pgtime);
console.info('Now, Timestamp, Redis, pgtime, Pg', d, data2.dateutc, pgtime);
console.info('Now, Timestamp, Redis, pgtime, Pg', d, data3.dateutc, pgtime);

const data = decodeStationData(data1);
const pgData = {
  eventrain: data.eventrain.toFixed(1),
  hourlyrain: data.hourlyrain.toFixed(1),
  humidity: data.humidity.toFixed(0),
  humidityin: data.humidityin.toFixed(0),
  pressureabs: data.pressureabs.toFixed(1),
  pressurerel: data.pressurerel.toFixed(1),
  rainrate: data.rainrate.toFixed(1),
  solarradiation: data.solarradiation.toFixed(1),
  temp: data.temp.toFixed(1),
  tempin: data.tempin.toFixed(1),
  timestamp: new Date(data.timestamp.substr(0, 17) + '00' + data.timestamp.substr(19)),
  uv: data.uv.toFixed(0),
  winddir: data.winddir.toFixed(0),
  windgust: data.windgust.toFixed(1),
  windspeed: data.windspeed.toFixed(1),
};

postData(data1);
setTimeout(async () => {
  const sd = await fetchStationData();
  assert.deepStrictEqual(sd, decodeStationData(data1));
  console.info('Redis1 OK');
}, 1000);
setTimeout(() => postData(data2), 2000);
setTimeout(async () => {
  const sd = await fetchStationData();
  assert.deepStrictEqual(sd, decodeStationData(data2));
  console.info('Redis2 OK');
}, 3000);
setTimeout(() => postData(data3), 4000);
setTimeout(async () => {
  const sd = await fetchStationData();
  assert.deepStrictEqual(sd, decodeStationData(data3));
  console.info('Redis3 OK');
}, 5000);
setTimeout(async () => {
  const rows = await loadStationData();
  assert.deepStrictEqual(rows, pgData);
  console.info('PG OK');
}, 61000);
