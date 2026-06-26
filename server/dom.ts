/* eslint-disable no-unused-vars */
import cloneDeep from "lodash.clonedeep";
import {
  IDomTrendData,
  IDomData,
  IDomDataRaw,
  DomCfg,
  DOM_SENSORS,
} from "../common/domModel";
import { IMeasurement } from "./measurement";



export class Dom implements IMeasurement {
  cfg: DomCfg = new DomCfg();

  getStationID(): string {
    return this.cfg.STATION_ID;
  }

  /**
   * Aggregates raw dom sensor data samples into 2-minute buckets.
   * Note: This implements a "first sample wins" strategy (returning clone of data[0]).
   * This is intentional for the home automation/heating system, as telemetry metrics
   * (e.g. ambient/floor room temps, target requests, active boiler relays, low/night tariff statuses)
   * are slow-changing and should not be mathematically averaged (which would corrupt boolean states
   * or tariff modes).
   */
  aggregateRawData2Minute(minute: number, data: Array<IDomData>): IDomData | null {
    if (data.length === 0) return null;
    const deepCopy = cloneDeep(data[0]);
    const date = new Date(deepCopy.timestamp);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    deepCopy.timestamp = date;
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

}

export const dom = new Dom();
