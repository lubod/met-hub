import axios from 'axios';
import fetch from 'node-fetch';
import { Pool } from 'pg';
import { StationDataRaw } from './client/models/model';

const PG_PORT = parseInt(process.env.PG_PORT) || 5432;
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres';
const PG_DB = process.env.PG_DB || 'postgres';
const PG_HOST = process.env.PG_HOST || 'localhost';
const PG_USER = process.env.PG_USER || 'postgres';

console.info('PG: ' + PG_HOST);

process.env.STATION_PASSKEY = '33564A0851CC0C0D15FE3353FB8D8B47';

function random(min:number, max:number) {
  return Math.random() * (max - min) + min;
}

function generateData(d: Date) {
  d.setUTCMilliseconds(0);
  const data = new StationDataRaw();
  data.PASSKEY = '33564A0851CC0C0D15FE3353FB8D8B47';
  data.stationtype = 'EasyWeatherV1.5.2';
  data.wh65batt = 0;
  data.freq = '868M';
  data.model = 'WS2900_V2.01.10';
  data.dateutc = d.toISOString().replace('T', ' ').replace('.000Z', '');;
  data.tempinf = random(60, 80);
  console.info(data);
  return data;
}

generateData(new Date());

const data1 = {
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

const data2 = {
  PASSKEY: '33564A0851CC0C0D15FE3353FB8D8B47',
  stationtype: 'EasyWeatherV1.5.2',
  dateutc: '2021-04-06 08:42:00',
  tempinf: '74.2',
  humidityin: '63',
  baromrelin: '30.289',
  baromabsin: '29.542',
  tempf: '71.5',
  humidity: '73',
  winddir: '70',
  windspeedmph: '0.5',
  windgustmph: '1.2',
  maxdailygust: '3.4',
  rainratein: '0.000',
  eventrainin: '0.000',
  hourlyrainin: '0.000',
  dailyrainin: '0.000',
  weeklyrainin: '0.000',
  monthlyrainin: '0.201',
  totalrainin: '0.201',
  solarradiation: '20.45',
  uv: '0',
  wh65batt: '0',
  freq: '868M',
  model: 'WS2900_V2.01.10',
};

const redisData1 = {
  timestamp: '2021-04-09T13:11:16.000Z',
  tempin: 23.4,
  pressurerel: 1022.3,
  pressureabs: 997,
  temp: 21.9,
  windspeed: 0.6,
  windgust: 1.8,
  maxdailygust: 5.4,
  rainrate: 0,
  eventrain: 0,
  hourlyrain: 0,
  dailyrain: 0,
  weeklyrain: 0,
  monthlyrain: 5.1,
  totalrain: 5.1,
  solarradiation: 19,
  uv: 0,
  humidity: 72,
  humidityin: 62,
  winddir: 69,
};

const pgData = {
  timestamp: '2021-04-12T14:54:00.000Z',
  tempin: '23.4',
  humidityin: '62',
  pressurerel: '1022.3',
  pressureabs: '997.0',
  temp: '21.9',
  humidity: '72',
  winddir: '69',
  windspeed: '0.6',
  windgust: '1.8',
  rainrate: '0.0',
  solarradiation: '19.0',
  uv: '0',
  eventrain: '0.0',
  hourlyrain: '0.0',
};

const d = new Date();
d.setUTCMilliseconds(0);
const pgtime =
  d.getUTCFullYear() +
  '-' +
  (d.getUTCMonth() + 1) +
  '-' +
  d.getUTCDate() +
  ' ' +
  d.getUTCHours() +
  ':' +
  d.getUTCMinutes();

data1.dateutc = pgtime + ':' + d.getUTCSeconds();
data2.dateutc = pgtime + ':' + (d.getUTCSeconds() + 1);
redisData1.timestamp = d.toISOString();
pgData.timestamp =
  d.toISOString().substring(0, 17) + '00' + d.toISOString().substring(19);

console.info(
  'Now, Timestamp, Redis, pgtime, Pg',
  d,
  data1.dateutc,
  redisData1.timestamp,
  pgtime,
  pgData.timestamp
);

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

function fetchData(redisData: any) {
  const url = 'http://localhost:8082/api/getLastData/station';
  console.info(url);
  fetch(url, {
    headers: {
      Authorization: `Bearer 1`,
    },
  })
    .then((data) => {
      if (data.status === 401) {
        console.info('auth 401');
      }
      return data.json();
    })
    .then((json) => {
      if (JSON.stringify(json) === JSON.stringify(redisData)) {
        console.info('Redis OK');
      } else {
        console.error('Redis NOK');
        console.log(JSON.stringify(json), '\n', JSON.stringify(redisData));
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

async function loadStation() {
  const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DB,
    password: PG_PASSWORD,
    port: PG_PORT,
  });

  const client = await pool.connect();
  try {
    console.info('connected');

    let table = 'stanica';
    let queryText =
      'select * from ' + table + ' where timestamp="' + pgtime + '"';
    let res = await client.query(queryText);
    if (
      res.rowCount === 1 &&
      JSON.stringify(res.rows[0]) === JSON.stringify(pgData)
    ) {
      console.info('Pg OK');
    } else {
      console.error('Pg NOK', res);
      console.log(JSON.stringify(res.rows[0]), '\n', JSON.stringify(pgData));
    }
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    console.info('released');
  }
}

postData(data1);
setTimeout(() => fetchData(redisData1), 1000);
setTimeout(() => postData(data2), 2000);
setTimeout(() => fetchData(redisData1), 3000);
setTimeout(loadStation, 61000);
