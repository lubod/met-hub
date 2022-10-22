/* eslint-disable no-unused-vars */
import {
  IDomTrendData,
  IDomData,
  IDomDataRaw,
  DomCfg,
} from "../common/domModel";
import { IMeasurement } from "./measurement";

const cloneDeep = require("lodash.clonedeep");

// eslint-disable-next-line no-shadow
export enum TABLES {
  OBYVACKA_VZDUCH = "obyvacka_vzduch",
  OBYVACKA_PODLAHA = "obyvacka_podlaha",
  PRACOVNA_VZDUCH = "pracovna_vzduch",
  PRACOVNA_PODLAHA = "pracovna_podlaha",
  SPALNA_VZDUCH = "spalna_vzduch",
  SPALNA_PODLAHA = "spalna_podlaha",
  CHALANI_VZDUCH = "chalani_vzduch",
  CHALANI_PODLAHA = "chalani_podlaha",
  PETRA_VZDUCH = "petra_vzduch",
  PETRA_PODLAHA = "petra_podlaha",
  ZADVERIE_VZDUCH = "zadverie_vzduch",
  ZADVERIE_PODLAHA = "zadverie_podlaha",
  CHODBA_VZDUCH = "chodba_vzduch",
  CHODBA_PODLAHA = "chodba_podlaha",
  SATNA_VZDUCH = "satna_vzduch",
  SATNA_PODLAHA = "satna_podlaha",
  KUPELNA_HORE = "kupelna_hore",
  KUPELNA_DOLE = "kupelna_dole",
  VONKU = "vonku",
  TARIF = "tarif",
}

export class Dom implements IMeasurement {
  cfg: DomCfg = new DomCfg();

  getSocketChannel() {
    return this.cfg.SOCKET_CHANNEL;
  }

  getSocketTrendChannel() {
    return this.cfg.SOCKET_TREND_CHANNEL;
  }

  getRedisLastDataKey() {
    return this.cfg.REDIS_LAST_DATA_KEY;
  }

  getRedisMinuteDataKey() {
    return this.cfg.REDIS_MINUTE_DATA_KEY;
  }

  getRedisStoreChannel() {
    return this.cfg.REDIS_STORE_CHANNEL;
  }

  getRedisTrendKey() {
    return this.cfg.REDIS_TREND_KEY;
  }

  getQueryArray(table: string, data: IDomDataRaw) {
    switch (table) {
      case TABLES.OBYVACKA_VZDUCH:
      case TABLES.OBYVACKA_PODLAHA:
      case TABLES.PRACOVNA_VZDUCH:
      case TABLES.PRACOVNA_PODLAHA:
      case TABLES.SPALNA_VZDUCH:
      case TABLES.SPALNA_PODLAHA:
      case TABLES.CHALANI_VZDUCH:
      case TABLES.CHALANI_PODLAHA:
      case TABLES.PETRA_VZDUCH:
      case TABLES.PETRA_PODLAHA:
      case TABLES.ZADVERIE_VZDUCH:
      case TABLES.ZADVERIE_PODLAHA:
      case TABLES.CHODBA_VZDUCH:
      case TABLES.CHODBA_PODLAHA:
      case TABLES.SATNA_VZDUCH:
      case TABLES.SATNA_PODLAHA:
      case TABLES.KUPELNA_HORE:
      case TABLES.KUPELNA_DOLE:
        return [
          data.timestamp,
          data[table].temp,
          data[table].req,
          data[table].reqall,
          data[table].useroffset,
          data[table].maxoffset,
          data[table].kuri,
          data[table].low,
          data[table].leto,
        ];
      case TABLES.VONKU:
        return [
          data.timestamp,
          data[TABLES.VONKU].temp,
          data[TABLES.VONKU].humidity,
          data[TABLES.VONKU].rain,
        ];
      case TABLES.TARIF:
        return [data.timestamp, data[TABLES.TARIF].tarif];
      default:
        return null;
    }
  }

  getQueryText(table: string) {
    switch (table) {
      case TABLES.OBYVACKA_VZDUCH:
      case TABLES.OBYVACKA_PODLAHA:
      case TABLES.PRACOVNA_VZDUCH:
      case TABLES.PRACOVNA_PODLAHA:
      case TABLES.SPALNA_VZDUCH:
      case TABLES.SPALNA_PODLAHA:
      case TABLES.CHALANI_VZDUCH:
      case TABLES.CHALANI_PODLAHA:
      case TABLES.PETRA_VZDUCH:
      case TABLES.PETRA_PODLAHA:
      case TABLES.ZADVERIE_VZDUCH:
      case TABLES.ZADVERIE_PODLAHA:
      case TABLES.CHODBA_VZDUCH:
      case TABLES.CHODBA_PODLAHA:
      case TABLES.SATNA_VZDUCH:
      case TABLES.SATNA_PODLAHA:
      case TABLES.KUPELNA_HORE:
      case TABLES.KUPELNA_DOLE:
        return `insert into ${table}(timestamp, temp, req, reqall, useroffset, maxoffset, kuri, low, leto) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
      case TABLES.VONKU:
        return `insert into ${table}(timestamp, temp, humidity, rain) values ($1, $2, $3, $4)`;
      case TABLES.TARIF:
        return `insert into ${table}(timestamp, tarif) values ($1, $2)`;
      default:
        return null;
    }
  }

  getTables() {
    return [
      TABLES.OBYVACKA_VZDUCH,
      TABLES.OBYVACKA_PODLAHA,
      TABLES.PRACOVNA_VZDUCH,
      TABLES.PRACOVNA_PODLAHA,
      TABLES.SPALNA_VZDUCH,
      TABLES.SPALNA_PODLAHA,
      TABLES.CHALANI_VZDUCH,
      TABLES.CHALANI_PODLAHA,
      TABLES.PETRA_VZDUCH,
      TABLES.PETRA_PODLAHA,
      TABLES.ZADVERIE_VZDUCH,
      TABLES.ZADVERIE_PODLAHA,
      TABLES.CHODBA_VZDUCH,
      TABLES.CHODBA_PODLAHA,
      TABLES.SATNA_VZDUCH,
      TABLES.SATNA_PODLAHA,
      TABLES.KUPELNA_HORE,
      TABLES.KUPELNA_DOLE,
      TABLES.VONKU,
      TABLES.TARIF,
    ];
  }

  getColumns() {
    return this.cfg.COLUMNS;
  }

  transformTrendData(data: any) {
    // console.info('transformDomTrendData', data);
    const tmp = {} as IDomTrendData;
    tmp.timestamp = [];
    tmp.temp = [];
    tmp.humidity = [];
    tmp.rain = [];
    tmp.obyvacka_vzduch = [];
    tmp.obyvacka_podlaha = [];
    tmp.pracovna_vzduch = [];
    tmp.pracovna_podlaha = [];
    tmp.spalna_vzduch = [];
    tmp.spalna_podlaha = [];
    tmp.chalani_vzduch = [];
    tmp.chalani_podlaha = [];
    tmp.petra_vzduch = [];
    tmp.petra_podlaha = [];

    data.forEach((item: any) => {
      const value: IDomDataRaw = JSON.parse(item);
      tmp.timestamp.push(value.timestamp);
      tmp.temp.push(value.vonku.temp);
      tmp.humidity.push(value.vonku.humidity);
      tmp.rain.push(value.vonku.rain);
      tmp.obyvacka_vzduch.push(value.obyvacka_vzduch.temp);
      tmp.obyvacka_podlaha.push(value.obyvacka_podlaha.temp);
      tmp.pracovna_vzduch.push(value.pracovna_vzduch.temp);
      tmp.pracovna_podlaha.push(value.pracovna_podlaha.temp);
      tmp.spalna_vzduch.push(value.spalna_vzduch.temp);
      tmp.spalna_podlaha.push(value.spalna_podlaha.temp);
      tmp.chalani_vzduch.push(value.chalani_vzduch.temp);
      tmp.chalani_podlaha.push(value.chalani_podlaha.temp);
      tmp.petra_vzduch.push(value.petra_vzduch.temp);
      tmp.petra_podlaha.push(value.petra_podlaha.temp);
    });
    return tmp;
  }

  decodeData(data: IDomDataRaw) {
    //    console.log(data)
    const decoded: IDomData = {
      timestamp: data.timestamp,
      temp: data.vonku.temp,
      humidity: data.vonku.humidity,
      rain: data.vonku.rain,
      obyvacka_vzduch: data.obyvacka_vzduch.temp,
      obyvacka_podlaha: data.obyvacka_podlaha.temp,
      obyvacka_reqall: data.obyvacka_vzduch.reqall,
      obyvacka_kuri: data.obyvacka_podlaha.kuri,
      obyvacka_leto: data.obyvacka_podlaha.leto,
      obyvacka_low: data.obyvacka_podlaha.low,
      pracovna_vzduch: data.pracovna_vzduch.temp,
      pracovna_podlaha: data.pracovna_podlaha.temp,
      pracovna_reqall: data.pracovna_vzduch.reqall,
      pracovna_kuri: data.pracovna_podlaha.kuri,
      pracovna_leto: data.pracovna_podlaha.leto,
      pracovna_low: data.pracovna_podlaha.low,
      spalna_vzduch: data.spalna_vzduch.temp,
      spalna_podlaha: data.spalna_podlaha.temp,
      spalna_reqall: data.spalna_vzduch.reqall,
      spalna_kuri: data.spalna_podlaha.kuri,
      spalna_leto: data.spalna_podlaha.leto,
      spalna_low: data.spalna_podlaha.low,
      chalani_vzduch: data.chalani_vzduch.temp,
      chalani_podlaha: data.chalani_podlaha.temp,
      chalani_reqall: data.chalani_vzduch.reqall,
      chalani_kuri: data.chalani_podlaha.kuri,
      chalani_leto: data.chalani_podlaha.leto,
      chalani_low: data.chalani_podlaha.low,
      petra_vzduch: data.petra_vzduch.temp,
      petra_podlaha: data.petra_podlaha.temp,
      petra_reqall: data.petra_vzduch.reqall,
      petra_kuri: data.petra_podlaha.kuri,
      petra_leto: data.petra_podlaha.leto,
      petra_low: data.petra_podlaha.low,
      place: "Dom",
    };
    const date = new Date(decoded.timestamp);
    const toStore = data;
    return { date, decoded, toStore };
  }

  agregateMinuteData(data: any) {
    const map = new Map();
    const deepCopy = cloneDeep(JSON.parse(data));
    const date = new Date(deepCopy.timestamp);
    date.setUTCSeconds(0);
    deepCopy.timestamp = date.toISOString();
    map.set(date.getTime(), deepCopy);
    console.info("Agregated dom minute", deepCopy.timestamp);
    return map;
  }
}
