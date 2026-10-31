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
    tmp.living_room_heat = [];
    tmp.guest_room_heat = [];
    tmp.bed_room_heat = [];
    tmp.boys_room_heat = [];
    tmp.petra_room_heat = [];
    tmp.entry_hall_heat = [];
    tmp.bath_down_heat = [];
    tmp.bath_up_heat = [];
    tmp.wardrobe_heat = [];
    tmp.hall_up_heat = [];
    tmp.entry_hall_floor = [];
    tmp.bath_down_floor = [];
    tmp.bath_up_floor = [];
    tmp.wardrobe_floor = [];
    tmp.hall_up_floor = [];

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
      tmp.living_room_heat!.push(Boolean(value.living_room_heat));
      tmp.guest_room_heat!.push(Boolean(value.guest_room_heat));
      tmp.bed_room_heat!.push(Boolean(value.bed_room_heat));
      tmp.boys_room_heat!.push(Boolean(value.boys_room_heat));
      tmp.petra_room_heat!.push(Boolean(value.petra_room_heat));
      tmp.entry_hall_heat!.push(Boolean(value.entry_hall_heat));
      tmp.bath_down_heat!.push(Boolean(value.bath_down_heat));
      tmp.bath_up_heat!.push(Boolean(value.bath_up_heat));
      tmp.wardrobe_heat!.push(Boolean(value.wardrobe_heat));
      tmp.hall_up_heat!.push(Boolean(value.hall_up_heat));

      if (value.entry_hall_floor != null) tmp.entry_hall_floor!.push(value.entry_hall_floor);
      if (value.bath_down_floor != null) tmp.bath_down_floor!.push(value.bath_down_floor);
      if (value.bath_up_floor != null) tmp.bath_up_floor!.push(value.bath_up_floor);
      if (value.wardrobe_floor != null) tmp.wardrobe_floor!.push(value.wardrobe_floor);
      if (value.hall_up_floor != null) tmp.hall_up_floor!.push(value.hall_up_floor);
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

      // Secondary house circuits
      entry_hall_air: data.zadverie_vzduch?.temp,
      entry_hall_floor: data.zadverie_podlaha?.temp,
      entry_hall_reqall: data.zadverie_vzduch?.reqall ?? data.zadverie_podlaha?.reqall,
      entry_hall_heat: Boolean(data.zadverie_podlaha?.kuri),
      entry_hall_off: Boolean(data.zadverie_podlaha?.leto),
      entry_hall_low: Boolean(data.zadverie_podlaha?.low),

      bath_down_air: data.kupelna_dole?.temp,
      bath_down_floor: data.kupelna_dole?.temp,
      bath_down_reqall: data.kupelna_dole?.reqall,
      bath_down_heat: Boolean(data.kupelna_dole?.kuri),
      bath_down_off: Boolean(data.kupelna_dole?.leto),
      bath_down_low: Boolean(data.kupelna_dole?.low),

      bath_up_air: data.kupelna_hore?.temp,
      bath_up_floor: data.kupelna_hore?.temp,
      bath_up_reqall: data.kupelna_hore?.reqall,
      bath_up_heat: Boolean(data.kupelna_hore?.kuri),
      bath_up_off: Boolean(data.kupelna_hore?.leto),
      bath_up_low: Boolean(data.kupelna_hore?.low),

      wardrobe_air: data.satna_vzduch?.temp,
      wardrobe_floor: data.satna_podlaha?.temp,
      wardrobe_reqall: data.satna_vzduch?.reqall ?? data.satna_podlaha?.reqall,
      wardrobe_heat: Boolean(data.satna_podlaha?.kuri),
      wardrobe_off: Boolean(data.satna_podlaha?.leto),
      wardrobe_low: Boolean(data.satna_podlaha?.low),

      hall_up_air: data.chodba_vzduch?.temp,
      hall_up_floor: data.chodba_podlaha?.temp,
      hall_up_reqall: data.chodba_vzduch?.reqall ?? data.chodba_podlaha?.reqall,
      hall_up_heat: Boolean(data.chodba_podlaha?.kuri),
      hall_up_off: Boolean(data.chodba_podlaha?.leto),
      hall_up_low: Boolean(data.chodba_podlaha?.low),
      place,
    };
    const date = new Date(decoded.timestamp);
    const toStore = decoded;
    return { date, decoded, toStore };
  }

}

export const dom = new Dom();
