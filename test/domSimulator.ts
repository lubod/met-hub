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
      timestamp: new Date(data.timestamp),
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
      entry_hall_air: data.entry_hall_air,
      entry_hall_floor: data.entry_hall_floor,
      entry_hall_reqall: data.entry_hall_reqall,
      entry_hall_heat: data.entry_hall_heat,
      entry_hall_off: data.entry_hall_off,
      entry_hall_low: data.entry_hall_low,
      bath_down_air: data.bath_down_air,
      bath_down_floor: data.bath_down_floor,
      bath_down_reqall: data.bath_down_reqall,
      bath_down_heat: data.bath_down_heat,
      bath_down_off: data.bath_down_off,
      bath_down_low: data.bath_down_low,
      bath_up_air: data.bath_up_air,
      bath_up_floor: data.bath_up_floor,
      bath_up_reqall: data.bath_up_reqall,
      bath_up_heat: data.bath_up_heat,
      bath_up_off: data.bath_up_off,
      bath_up_low: data.bath_up_low,
      wardrobe_air: data.wardrobe_air,
      wardrobe_floor: data.wardrobe_floor,
      wardrobe_reqall: data.wardrobe_reqall,
      wardrobe_heat: data.wardrobe_heat,
      wardrobe_off: data.wardrobe_off,
      wardrobe_low: data.wardrobe_low,
      hall_up_air: data.hall_up_air,
      hall_up_floor: data.hall_up_floor,
      hall_up_reqall: data.hall_up_reqall,
      hall_up_heat: data.hall_up_heat,
      hall_up_off: data.hall_up_off,
      hall_up_low: data.hall_up_low,
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
      entry_hall_air: decoded.entry_hall_air?.toFixed(1),
      entry_hall_floor: decoded.entry_hall_floor?.toFixed(1),
      entry_hall_reqall: decoded.entry_hall_reqall?.toFixed(1),
      entry_hall_heat: decoded.entry_hall_heat,
      entry_hall_off: decoded.entry_hall_off,
      entry_hall_low: decoded.entry_hall_low,
      bath_down_air: decoded.bath_down_air?.toFixed(1),
      bath_down_floor: decoded.bath_down_floor?.toFixed(1),
      bath_down_reqall: decoded.bath_down_reqall?.toFixed(1),
      bath_down_heat: decoded.bath_down_heat,
      bath_down_off: decoded.bath_down_off,
      bath_down_low: decoded.bath_down_low,
      bath_up_air: decoded.bath_up_air?.toFixed(1),
      bath_up_floor: decoded.bath_up_floor?.toFixed(1),
      bath_up_reqall: decoded.bath_up_reqall?.toFixed(1),
      bath_up_heat: decoded.bath_up_heat,
      bath_up_off: decoded.bath_up_off,
      bath_up_low: decoded.bath_up_low,
      wardrobe_air: decoded.wardrobe_air?.toFixed(1),
      wardrobe_floor: decoded.wardrobe_floor?.toFixed(1),
      wardrobe_reqall: decoded.wardrobe_reqall?.toFixed(1),
      wardrobe_heat: decoded.wardrobe_heat,
      wardrobe_off: decoded.wardrobe_off,
      wardrobe_low: decoded.wardrobe_low,
      hall_up_air: decoded.hall_up_air?.toFixed(1),
      hall_up_floor: decoded.hall_up_floor?.toFixed(1),
      hall_up_reqall: decoded.hall_up_reqall?.toFixed(1),
      hall_up_heat: decoded.hall_up_heat,
      hall_up_off: decoded.hall_up_off,
      hall_up_low: decoded.hall_up_low,
    };
  }

  async postData(data: any) {
    try {
      const passkey = process.env.DOM_PASSKEY || "dev-dom-passkey";
      await axios.post(`http://localhost:8089/setDomData?PASSKEY=${passkey}`, data, {
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
