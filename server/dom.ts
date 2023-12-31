/* eslint-disable no-unused-vars */
import {
  IDomTrendData,
  IDomData,
  IDomDataRaw,
  DomCfg,
  DOM_SENSORS,
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

  getStationID(): string {
    return this.cfg.STATION_ID;
  }

  aggregateRawData2Minute(minute: number, data: Array<IDomData>): any {
    const deepCopy = cloneDeep(data[0]); // todo
    const date = new Date(deepCopy.timestamp);
    date.setUTCSeconds(0);
    deepCopy.timestamp = date.toISOString();
    console.info("Aggregated dom minute", date);
    return deepCopy;
  }

  getSocketChannel() {
    return this.cfg.SOCKET_CHANNEL;
  }

  getSocketTrendChannel() {
    return this.cfg.SOCKET_TREND_CHANNEL;
  }

  getRedisLastDataKey() {
    return this.cfg.REDIS_LAST_DATA_KEY;
  }

  getRedisRawDataKey() {
    return this.cfg.REDIS_MINUTE_DATA_KEY;
  }

  getRedisTSKeyPrefix() {
    return this.cfg.REDIS_TS_KEY;
  }

  getKafkaStoreTopic() {
    return this.cfg.KAFKA_STORE_TOPIC;
  }

  getRedisTrendKey() {
    return this.cfg.REDIS_TREND_KEY;
  }

  getKafkaKey(): string {
    return this.cfg.KAFKA_KEY;
  }

  getTables() {
    return ["station_dom"];
  }

  getSensors() {
    return DOM_SENSORS;
  }

  transformTrendData(data: any) {
    // console.info("transformDomTrendData", data);
    const tmp = {} as IDomTrendData;
    tmp.timestamp = [];
    tmp.temp = [];
    tmp.humidity = [];
    tmp.rain = [];
    tmp.tarif = [];
    tmp.living_room_air = [];
    tmp.living_room_floor = [];
    tmp.guest_room_air = [];
    tmp.guest_room_floor = [];
    tmp.bed_room_air = [];
    tmp.bed_room_floor = [];
    tmp.boys_room_air = [];
    tmp.boys_room_floor = [];
    tmp.petra_room_air = [];
    tmp.petra_room_floor = [];

    data.forEach((item: any) => {
      const value: IDomData = JSON.parse(item);
      // console.info("value", value);
      tmp.timestamp.push(value.timestamp);
      tmp.temp.push(value.temp);
      tmp.humidity.push(value.humidity);
      tmp.rain.push(value.rain);
      tmp.tarif.push(value.tarif);
      tmp.living_room_air.push(value.living_room_air);
      tmp.living_room_floor.push(value.living_room_floor);
      tmp.guest_room_air.push(value.guest_room_air);
      tmp.guest_room_floor.push(value.guest_room_floor);
      tmp.bed_room_air.push(value.bed_room_air);
      tmp.bed_room_floor.push(value.bed_room_floor);
      tmp.boys_room_air.push(value.boys_room_air);
      tmp.boys_room_floor.push(value.boys_room_floor);
      tmp.petra_room_air.push(value.petra_room_air);
      tmp.petra_room_floor.push(value.petra_room_floor);
    });
    return tmp;
  }

  decodeData(data: IDomDataRaw, place: string) {
    //    console.log(data)
    const decoded: IDomData = {
      timestamp: new Date(data.timestamp),
      temp: data.vonku.temp,
      humidity: data.vonku.humidity,
      rain: Boolean(data.vonku.rain),
      tarif: data.tarif.tarif,
      living_room_air: data.obyvacka_vzduch.temp,
      living_room_floor: data.obyvacka_podlaha.temp,
      living_room_reqall: data.obyvacka_vzduch.reqall,
      living_room_heat: Boolean(data.obyvacka_podlaha.kuri),
      living_room_off: Boolean(data.obyvacka_podlaha.leto),
      living_room_low: Boolean(data.obyvacka_podlaha.low),
      guest_room_air: data.pracovna_vzduch.temp,
      guest_room_floor: data.pracovna_podlaha.temp,
      guest_room_reqall: data.pracovna_vzduch.reqall,
      guest_room_heat: Boolean(data.pracovna_podlaha.kuri),
      guest_room_off: Boolean(data.pracovna_podlaha.leto),
      guest_room_low: Boolean(data.pracovna_podlaha.low),
      bed_room_air: data.spalna_vzduch.temp,
      bed_room_floor: data.spalna_podlaha.temp,
      bed_room_reqall: data.spalna_vzduch.reqall,
      bed_room_heat: Boolean(data.spalna_podlaha.kuri),
      bed_room_off: Boolean(data.spalna_podlaha.leto),
      bed_room_low: Boolean(data.spalna_podlaha.low),
      boys_room_air: data.chalani_vzduch.temp,
      boys_room_floor: data.chalani_podlaha.temp,
      boys_room_reqall: data.chalani_vzduch.reqall,
      boys_room_heat: Boolean(data.chalani_podlaha.kuri),
      boys_room_off: Boolean(data.chalani_podlaha.leto),
      boys_room_low: Boolean(data.chalani_podlaha.low),
      petra_room_air: data.petra_vzduch.temp,
      petra_room_floor: data.petra_podlaha.temp,
      petra_room_reqall: data.petra_vzduch.reqall,
      petra_room_heat: Boolean(data.petra_podlaha.kuri),
      petra_room_off: Boolean(data.petra_podlaha.leto),
      petra_room_low: Boolean(data.petra_podlaha.low),
      place,
    };
    const date = new Date(decoded.timestamp);
    const toStore = decoded;
    return { date, decoded, toStore };
  }

  aggregateMinuteData(data: any) {
    const map = new Map();
    const deepCopy = cloneDeep(JSON.parse(data));
    const date = new Date(deepCopy.timestamp);
    date.setUTCSeconds(0);
    deepCopy.timestamp = date.toISOString();
    map.set(date.getTime(), deepCopy);
    console.info("Aggregated dom minute", deepCopy.timestamp);
    return map;
  }
}
