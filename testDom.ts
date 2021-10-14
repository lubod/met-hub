import assert from 'assert';
import axios from 'axios';
import fetch from 'node-fetch';
import { Pool } from 'pg';
import { Dom } from './server/dom';
import { IDomDataRaw, IDomExternalData, IDomRoomData, IDomTarifData } from './common/models/domModel';

const PG_PORT = parseInt(process.env.PG_PORT) || 15432;
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres';
const PG_DB = process.env.PG_DB || 'postgres';
const PG_HOST = process.env.PG_HOST || '192.168.1.199';
const PG_USER = process.env.PG_USER || 'postgres';
const dom = new Dom();

console.info('PG: ' + PG_HOST);

process.env.DOM_PASSKEY = '7d060d4d-c95f-4774-a0ec-a85c8952b9d9';

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function round(value: number, precision: number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function generateRoomData() {
    const data = {} as IDomRoomData;

    data.kuri = 0;
    data.leto = 0;
    data.low = 0;
    data.maxoffset = 5;
    data.req = 0;
    data.reqall = 0;
    data.temp = round(random(15, 30), 1);
    data.text = '';
    data.useroffset = 0;
    return data;
}

function generateExternalData() {
    const data = {} as IDomExternalData;

    data.temp = round(random(15, 30), 1);
    data.humidity = round(random(40, 60), 0);
    data.rain = round(random(0, 1), 0);
    data.text = '';
    return data;
}

function generateTarifData() {
    const data = {} as IDomTarifData;

    data.text = '';
    data.tarif = 0;
    return data;
}

function generateData(d: Date) {
    d.setUTCMilliseconds(0);
    const data = {} as IDomDataRaw;
    data.PASSKEY = '7d060d4d-c95f-4774-a0ec-a85c8952b9d9';
    data.dateutc = d.toISOString().replace('T', ' ').replace('.000Z', '');
    data.timestamp = d.toISOString();
    data.tarif = generateTarifData();
    data.vonku = generateExternalData();
    data.obyvacka_vzduch = generateRoomData();
    data.obyvacka_podlaha = generateRoomData();
    data.pracovna_vzduch = generateRoomData();
    data.pracovna_podlaha = generateRoomData();
    data.spalna_vzduch = generateRoomData();
    data.spalna_podlaha = generateRoomData();
    data.chalani_vzduch = generateRoomData();
    data.chalani_podlaha = generateRoomData();
    data.petra_vzduch = generateRoomData();
    data.petra_podlaha = generateRoomData();
    data.zadverie_vzduch = generateRoomData();
    data.zadverie_podlaha = generateRoomData();
    data.chodba_vzduch = generateRoomData();
    data.chodba_podlaha = generateRoomData();
    data.satna_vzduch = generateRoomData();
    data.satna_podlaha = generateRoomData();
    data.kupelna_hore = generateRoomData();
    data.kupelna_dole = generateRoomData();

    return data;
}

/*
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
*/

/*
Sep 07 10:50:42 zaloha node[926]: { obyvacka_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 22.9,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   zadverie_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.2,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   pracovna_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 22.3,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   chodba_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.3,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   satna_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.2,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   petra_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.4,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   chalani_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 24,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   spalna_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.5,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   kupelna_dole:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 22.5,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   kupelna_hore:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   obyvacka_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 24.8,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   zadverie_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.5,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   pracovna_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.9,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   chodba_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.4,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   satna_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.2,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   petra_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.5,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   chalani_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 24.2,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   spalna_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.7,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   vonku: DomExternalData { temp: 20.2, humidity: 25, rain: 0 },
Sep 07 10:50:42 zaloha node[926]:   tarif: DomTarifData { tarif: 1 },
Sep 07 10:50:42 zaloha node[926]:   timestamp: 2021-09-07T08:50:42.780Z,
Sep 07 10:50:42 zaloha node[926]:   dateutc: '2021-9-7 8:50:42',
Sep 07 10:50:42 zaloha node[926]:   PASSKEY: '7d060d4d-c95f-4774-a0ec-a85c8952b9d9' }
*/

async function postData(data: any) {
    try {
        await axios.post('http://localhost:8082/setDomData', data, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchStationData() {
    const url = 'http://localhost:8082/api/getLastData/dom';
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

async function loadDomData() {
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

const data1 = generateData(new Date());
//const data2 = generateOffsetData(data1, 5);
//const data3 = generateOffsetData(data1, -5);
//console.info(data1);
//console.info(data2);
//console.info(data3);
//console.log(decodedData1);

const d = new Date();
d.setUTCMilliseconds(0);
const pgtime = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate() + ' ' + d.getUTCHours() + ':' + d.getUTCMinutes();

data1.dateutc = pgtime + ':' + d.getUTCSeconds();
//data2.dateutc = pgtime + ':' + (d.getUTCSeconds() + 2);
//data3.dateutc = pgtime + ':' + (d.getUTCSeconds() + 4);

console.info('Now, Timestamp, Redis, pgtime, Pg', d, data1.dateutc, pgtime);
//console.info('Now, Timestamp, Redis, pgtime, Pg', d, data2.dateutc, pgtime);
//console.info('Now, Timestamp, Redis, pgtime, Pg', d, data3.dateutc, pgtime);

postData(data1);

setTimeout(async () => {
  const sd = await fetchStationData();
  assert.deepStrictEqual(sd, dom.decodeData(data1).decoded);
  console.info('Redis1 OK');
}, 1000);

/*
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
*/