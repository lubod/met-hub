import assert from "assert";
import axios from "axios";
import fetch from "node-fetch";
import { Pool } from "pg";
import { Dom, TABLES } from "../server/dom";
import {
  IDomData,
  IDomDataRaw,
  IDomExternalData,
  IDomRoomData,
  IDomTarifData,
} from "../common/domModel";
import DomCtrl from "../client/dom/domCtrl";
import MySocket from "../client/socket";
import AuthData from "../client/auth/authData";
import { AllStationsCfg } from "../common/allStationsCfg";

const PG_PORT = parseInt(process.env.PG_PORT, 10) || 15432;
const PG_PASSWORD = process.env.PG_PASSWORD || "postgres";
const PG_DB = process.env.PG_DB || "postgres";
const PG_HOST = process.env.PG_HOST || "192.168.1.199";
const PG_USER = process.env.PG_USER || "postgres";
const dom = new Dom();

console.info(`PG: ${PG_HOST}`);

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function round(value: number, precision: number) {
  const multiplier = 10 ** (precision || 0);
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
  data.text = "";
  data.useroffset = 0;
  return data;
}

function generateExternalData() {
  const data = {} as IDomExternalData;

  data.temp = round(random(15, 30), 1);
  data.humidity = round(random(40, 60), 0);
  data.rain = round(random(0, 1), 0);
  data.text = "";
  return data;
}

function generateTarifData() {
  const data = {} as IDomTarifData;

  data.text = "";
  data.tarif = 0;
  return data;
}

function generateData(d: Date, PASSKEY: string) {
  d.setUTCMilliseconds(0);
  const data = {} as IDomDataRaw;
  data.PASSKEY = PASSKEY;
  data.dateutc = d.toISOString().replace("T", " ").replace(".000Z", "");
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
Sep 07 10:50:42 zaloha node[926]:   PASSKEY: '' }
*/

async function postData(data: any) {
  try {
    await axios.post("http://localhost:18080/setDomData", data, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function fetchDomData() {
  const url = "http://localhost:18080/api/getLastData/dom";
  console.info(url);

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

async function loadDomData(time: string) {
  const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DB,
    password: PG_PASSWORD,
    port: PG_PORT,
  });

  const client = await pool.connect();
  async function loadRoomData(table: string) {
    const queryText = `select * from ${table} where timestamp='${time}:00+00'`;
    const res = await client.query(queryText);
    // console.log('rows', queryText, res.rows);
    const room = {
      kuri: res.rows[0].kuri ? 1 : 0,
      leto: res.rows[0].leto ? 1 : 0,
      low: res.rows[0].low ? 1 : 0,
      maxoffset: parseInt(res.rows[0].maxoffset, 10),
      req: parseInt(res.rows[0].req, 10),
      reqall: parseInt(res.rows[0].reqall, 10),
      temp: parseFloat(res.rows[0].temp),
      text: "",
      useroffset: parseInt(res.rows[0].useroffset, 10),
    } as IDomRoomData;
    return room;
  }

  async function loadExternalData(table: string) {
    const queryText = `select * from ${table} where timestamp='${time}:00+00'`;
    const res = await client.query(queryText);
    // console.log('rows', queryText, res.rows);
    const room = {
      temp: parseFloat(res.rows[0].temp),
      humidity: parseFloat(res.rows[0].humidity),
      rain: res.rows[0].rain ? 1 : 0,
      text: "",
    } as IDomExternalData;
    return room;
  }

  async function loadTarifData(table: string) {
    const queryText = `select * from ${table} where timestamp='${time}:00+00'`;
    const res = await client.query(queryText);
    // console.log('rows', queryText, res.rows);
    const room = {
      tarif: parseInt(res.rows[0].tarif, 10),
      text: "",
    } as IDomTarifData;
    return room;
  }

  try {
    console.info("connected", new Date());

    const data = {} as IDomDataRaw;

    data[TABLES.OBYVACKA_VZDUCH] = await loadRoomData(TABLES.OBYVACKA_VZDUCH);
    data[TABLES.OBYVACKA_PODLAHA] = await loadRoomData(TABLES.OBYVACKA_PODLAHA);
    data[TABLES.PRACOVNA_VZDUCH] = await loadRoomData(TABLES.PRACOVNA_VZDUCH);
    data[TABLES.PRACOVNA_PODLAHA] = await loadRoomData(TABLES.PRACOVNA_PODLAHA);
    data[TABLES.SPALNA_VZDUCH] = await loadRoomData(TABLES.SPALNA_VZDUCH);
    data[TABLES.SPALNA_PODLAHA] = await loadRoomData(TABLES.SPALNA_PODLAHA);
    data[TABLES.CHALANI_VZDUCH] = await loadRoomData(TABLES.CHALANI_VZDUCH);
    data[TABLES.CHALANI_PODLAHA] = await loadRoomData(TABLES.CHALANI_PODLAHA);
    data[TABLES.PETRA_VZDUCH] = await loadRoomData(TABLES.PETRA_VZDUCH);
    data[TABLES.PETRA_PODLAHA] = await loadRoomData(TABLES.PETRA_PODLAHA);
    data[TABLES.ZADVERIE_VZDUCH] = await loadRoomData(TABLES.ZADVERIE_VZDUCH);
    data[TABLES.ZADVERIE_PODLAHA] = await loadRoomData(TABLES.ZADVERIE_PODLAHA);
    data[TABLES.CHODBA_VZDUCH] = await loadRoomData(TABLES.CHODBA_VZDUCH);
    data[TABLES.CHODBA_PODLAHA] = await loadRoomData(TABLES.CHODBA_PODLAHA);
    data[TABLES.SATNA_VZDUCH] = await loadRoomData(TABLES.SATNA_VZDUCH);
    data[TABLES.SATNA_PODLAHA] = await loadRoomData(TABLES.SATNA_PODLAHA);
    data[TABLES.KUPELNA_HORE] = await loadRoomData(TABLES.KUPELNA_HORE);
    data[TABLES.KUPELNA_DOLE] = await loadRoomData(TABLES.KUPELNA_DOLE);
    data[TABLES.VONKU] = await loadExternalData(TABLES.VONKU);
    data[TABLES.TARIF] = await loadTarifData(TABLES.TARIF);
    data.dateutc = `${time}:00`;
    // console.info(data);
    return data;
  } catch (e) {
    console.error(e);
  } finally {
    client.release();
    console.info("released");
  }
  return null;
}

function getClientDomData(data: IDomData) {
  const cdd: IDomData = {
    timestamp: data.timestamp,
    place: data.place,
    temp: data.temp,
    humidity: data.humidity,
    rain: data.rain,
    obyvacka_vzduch: data.obyvacka_vzduch,
    obyvacka_podlaha: data.obyvacka_podlaha,
    obyvacka_reqall: data.obyvacka_reqall,
    obyvacka_kuri: data.obyvacka_kuri,
    obyvacka_leto: data.obyvacka_leto,
    obyvacka_low: data.obyvacka_low,
    pracovna_vzduch: data.pracovna_vzduch,
    pracovna_podlaha: data.pracovna_podlaha,
    pracovna_reqall: data.pracovna_reqall,
    pracovna_kuri: data.pracovna_kuri,
    pracovna_leto: data.pracovna_leto,
    pracovna_low: data.pracovna_low,
    spalna_vzduch: data.spalna_vzduch,
    spalna_podlaha: data.spalna_podlaha,
    spalna_reqall: data.spalna_reqall,
    spalna_kuri: data.spalna_kuri,
    spalna_leto: data.spalna_leto,
    spalna_low: data.spalna_low,
    chalani_vzduch: data.chalani_vzduch,
    chalani_podlaha: data.chalani_podlaha,
    chalani_reqall: data.chalani_reqall,
    chalani_kuri: data.chalani_kuri,
    chalani_leto: data.chalani_leto,
    chalani_low: data.chalani_low,
    petra_vzduch: data.petra_vzduch,
    petra_podlaha: data.petra_podlaha,
    petra_reqall: data.petra_reqall,
    petra_kuri: data.petra_kuri,
    petra_leto: data.petra_leto,
    petra_low: data.petra_low,
  };
  return cdd;
}

function main(PASSKEY: string) {
  const data1 = generateData(new Date(), PASSKEY);

  const d = new Date();
  d.setUTCMilliseconds(0);

  function addZero(val: number) {
    if (val > 9) {
      return val;
    }
    return `0${val}`;
  }
  const pgtime = `${d.getUTCFullYear()}-${addZero(
    d.getUTCMonth() + 1
  )}-${addZero(d.getUTCDate())} ${addZero(d.getUTCHours())}:${addZero(
    d.getUTCMinutes()
  )}`;

  data1.dateutc = `${pgtime}:${d.getUTCSeconds()}`;
  const toMinute = Date.now() % 60000;

  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data1.dateutc, pgtime);

  const socket = new MySocket();
  const domCtrl = new DomCtrl(socket, new AuthData());
  domCtrl.start();
  postData(data1);

  setTimeout(async () => {
    const sd = await fetchDomData();
    assert.deepStrictEqual(sd, dom.decodeData(data1).decoded);
    console.info("Redis1 OK");
    assert.deepStrictEqual(
      getClientDomData(domCtrl.domData.data),
      dom.decodeData(data1).decoded
    );
    console.info("Client1 OK");
  }, 1000);

  setTimeout(async () => {
    const rows = await loadDomData(pgtime);
    data1.dateutc = `${pgtime}:00`;
    rows.timestamp = d.toISOString();
    rows.PASSKEY = PASSKEY;
    assert.deepStrictEqual(rows, data1);
    console.info("PG OK");
  }, 61000 - toMinute);
}

const allStationsCfg = new AllStationsCfg();
allStationsCfg.readCfg().then(() => {
  const PASSKEY = allStationsCfg.getStationByID("dom").passkey;
  main(PASSKEY);
});
