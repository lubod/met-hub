import axios from "axios";
import {
  IDomData,
  IDomDataRaw,
  IDomExternalData,
  IDomRoomData,
  IDomTarifData,
} from "../common/domModel";
import { IStationData } from "../common/stationModel";
import { random, round } from "../common/units";
import { CSimulator } from "./simulator";

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

// eslint-disable-next-line import/prefer-default-export
export class DomSimulator extends CSimulator {
  generateRoomData() {
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

  generateExternalData() {
    const data = {} as IDomExternalData;

    data.temp = round(random(15, 30), 1);
    data.humidity = round(random(40, 60), 0);
    data.rain = round(random(0, 1), 0);
    data.text = "";
    return data;
  }

  generateTarifData() {
    const data = {} as IDomTarifData;

    data.text = "";
    data.tarif = 1;
    return data;
  }

  generateData(d: Date, PASSKEY: string) {
    d.setUTCMilliseconds(0);
    const data = {} as IDomDataRaw;
    data.PASSKEY = PASSKEY;
    data.dateutc = d.toISOString().replace("T", " ").replace(".000Z", "");
    data.timestamp = d.toISOString();
    data.tarif = this.generateTarifData();
    data.vonku = this.generateExternalData();
    data.obyvacka_vzduch = this.generateRoomData();
    data.obyvacka_podlaha = this.generateRoomData();
    data.pracovna_vzduch = this.generateRoomData();
    data.pracovna_podlaha = this.generateRoomData();
    data.spalna_vzduch = this.generateRoomData();
    data.spalna_podlaha = this.generateRoomData();
    data.chalani_vzduch = this.generateRoomData();
    data.chalani_podlaha = this.generateRoomData();
    data.petra_vzduch = this.generateRoomData();
    data.petra_podlaha = this.generateRoomData();
    data.zadverie_vzduch = this.generateRoomData();
    data.zadverie_podlaha = this.generateRoomData();
    data.chodba_vzduch = this.generateRoomData();
    data.chodba_podlaha = this.generateRoomData();
    data.satna_vzduch = this.generateRoomData();
    data.satna_podlaha = this.generateRoomData();
    data.kupelna_hore = this.generateRoomData();
    data.kupelna_dole = this.generateRoomData();
    return data;
  }

  // eslint-disable-next-line no-unused-vars
  generateOffsetData(cdata: any, offset: number) {
    return cdata; // todo
  }

  getClientStationData(data: any) {
    const cdd: IDomData = {
      timestamp: data.timestamp,
      place: data.place,
      temp: data.temp,
      humidity: data.humidity,
      rain: data.rain,
      tarif: data.tarif,
      living_room_air: data.living_room_air,
      living_room_floor: data.living_room_floor,
      living_room_reqall: data.living_room_reqall,
      living_room_heat: data.living_room_heat,
      living_room_off: data.living_room_off,
      living_room_low: data.living_room_low,
      guest_room_air: data.guest_room_air,
      guest_room_floor: data.guest_room_floor,
      guest_room_reqall: data.guest_room_reqall,
      guest_room_heat: data.guest_room_heat,
      guest_room_off: data.guest_room_off,
      guest_room_low: data.guest_room_low,
      bed_room_air: data.bed_room_air,
      bed_room_floor: data.bed_room_floor,
      bed_room_reqall: data.bed_room_reqall,
      bed_room_heat: data.bed_room_heat,
      bed_room_off: data.bed_room_off,
      bed_room_low: data.bed_room_low,
      boys_room_air: data.boys_room_air,
      boys_room_floor: data.boys_room_floor,
      boys_room_reqall: data.boys_room_reqall,
      boys_room_heat: data.boys_room_heat,
      boys_room_off: data.boys_room_off,
      boys_room_low: data.boys_room_low,
      petra_room_air: data.petra_room_air,
      petra_room_floor: data.petra_room_floor,
      petra_room_reqall: data.petra_room_reqall,
      petra_room_heat: data.petra_room_heat,
      petra_room_off: data.petra_room_off,
      petra_room_low: data.petra_room_low,
    };
    return cdd;
  }

  getPGData(decoded: any) {
    return {
      timestamp: decoded.timestamp,
      temp: decoded.temp.toFixed(1),
      humidity: decoded.humidity.toFixed(1),
      tarif: decoded.tarif.toFixed(0),
      rain: decoded.rain,
      living_room_air: decoded.living_room_air.toFixed(1),
      living_room_floor: decoded.living_room_floor.toFixed(1),
      living_room_reqall: decoded.living_room_reqall.toFixed(1),
      living_room_heat: decoded.living_room_heat,
      living_room_off: decoded.living_room_off,
      living_room_low: decoded.living_room_low,
      guest_room_air: decoded.guest_room_air.toFixed(1),
      guest_room_floor: decoded.guest_room_floor.toFixed(1),
      guest_room_reqall: decoded.guest_room_reqall.toFixed(1),
      guest_room_heat: decoded.guest_room_heat,
      guest_room_off: decoded.guest_room_off,
      guest_room_low: decoded.guest_room_low,
      bed_room_air: decoded.bed_room_air.toFixed(1),
      bed_room_floor: decoded.bed_room_floor.toFixed(1),
      bed_room_reqall: decoded.bed_room_reqall.toFixed(1),
      bed_room_heat: decoded.bed_room_heat,
      bed_room_off: decoded.bed_room_off,
      bed_room_low: decoded.bed_room_low,
      boys_room_air: decoded.boys_room_air.toFixed(1),
      boys_room_floor: decoded.boys_room_floor.toFixed(1),
      boys_room_reqall: decoded.boys_room_reqall.toFixed(1),
      boys_room_heat: decoded.boys_room_heat,
      boys_room_off: decoded.boys_room_off,
      boys_room_low: decoded.boys_room_low,
      petra_room_air: decoded.petra_room_air.toFixed(1),
      petra_room_floor: decoded.petra_room_floor.toFixed(1),
      petra_room_reqall: decoded.petra_room_reqall.toFixed(1),
      petra_room_heat: decoded.petra_room_heat,
      petra_room_off: decoded.petra_room_off,
      petra_room_low: decoded.petra_room_low,
    };
  }

  async postData(data: any) {
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

  // eslint-disable-next-line no-unused-vars
  correctTimestamp(decoded: IDomData | IStationData, sd: any) {
    // eslint-disable-next-line no-param-reassign
    decoded.timestamp = sd.timestamp;
  }
}
