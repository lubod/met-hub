/* eslint-disable max-classes-per-file */
import MY_COLORS from "./colors";
import { ISensor } from "./sensor";
import { propName } from "./units";

export interface IDomExternalData {
  temp: number;
  humidity: number;
  rain: number;
  text: string;
}

export interface IDomRoomData {
  temp: number;
  req: number;
  reqall: number;
  useroffset: number;
  maxoffset: number;
  kuri: number;
  low: number;
  leto: number;
  text: string;
}

export interface IDomTarifData {
  tarif: number;
  text: string;
}

export interface IDomDataRaw {
  timestamp: string;
  PASSKEY: string;
  dateutc: string;
  tarif: IDomTarifData;
  vonku: IDomExternalData;
  obyvacka_vzduch: IDomRoomData;
  obyvacka_podlaha: IDomRoomData;
  pracovna_vzduch: IDomRoomData;
  pracovna_podlaha: IDomRoomData;
  spalna_vzduch: IDomRoomData;
  spalna_podlaha: IDomRoomData;
  chalani_vzduch: IDomRoomData;
  chalani_podlaha: IDomRoomData;
  petra_vzduch: IDomRoomData;
  petra_podlaha: IDomRoomData;
  zadverie_vzduch: IDomRoomData;
  zadverie_podlaha: IDomRoomData;
  chodba_vzduch: IDomRoomData;
  chodba_podlaha: IDomRoomData;
  satna_vzduch: IDomRoomData;
  satna_podlaha: IDomRoomData;
  kupelna_hore: IDomRoomData;
  kupelna_dole: IDomRoomData;
}

export interface IDomData {
  timestamp: Date;
  place: string;
  temp: number;
  humidity: number;
  rain: boolean;
  tarif: number;
  living_room_air: number;
  living_room_floor: number;
  living_room_reqall: number;
  living_room_heat: boolean;
  living_room_off: boolean;
  living_room_low: boolean;
  guest_room_air: number;
  guest_room_floor: number;
  guest_room_reqall: number;
  guest_room_heat: boolean;
  guest_room_off: boolean;
  guest_room_low: boolean;
  bed_room_air: number;
  bed_room_floor: number;
  bed_room_reqall: number;
  bed_room_heat: boolean;
  bed_room_off: boolean;
  bed_room_low: boolean;
  boys_room_air: number;
  boys_room_floor: number;
  boys_room_reqall: number;
  boys_room_heat: boolean;
  boys_room_off: boolean;
  boys_room_low: boolean;
  petra_room_air: number;
  petra_room_floor: number;
  petra_room_reqall: number;
  petra_room_heat: boolean;
  petra_room_off: boolean;
  petra_room_low: boolean;
}

export interface IDomTrendData {
  timestamp: Array<Date>;
  temp: Array<number>;
  humidity: Array<number>;
  rain: Array<boolean>;
  tarif: Array<number>;
  living_room_air: Array<number>;
  living_room_floor: Array<number>;
  guest_room_air: Array<number>;
  guest_room_floor: Array<number>;
  bed_room_air: Array<number>;
  bed_room_floor: Array<number>;
  boys_room_air: Array<number>;
  boys_room_floor: Array<number>;
  petra_room_air: Array<number>;
  petra_room_floor: Array<number>;
}

const dom = {} as IDomData;

export class DOM_SENSORS_DESC {
  static TEMPERATURE: ISensor = {
    col: propName(dom).temp,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: true,
    table: "dom",
    label: "T",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).temp,
    agg: "avg",
  };

  static HUMIDITY: ISensor = {
    col: propName(dom).humidity,
    unit: "%",
    fix: 0,
    range: 10,
    couldBeNegative: false,
    table: "dom",
    label: "H",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
    id: propName(dom).humidity,
    agg: "avg",
  };

  static RAIN: ISensor = {
    col: propName(dom).rain,
    unit: "",
    fix: 0,
    range: 1,
    couldBeNegative: false,
    table: "dom",
    label: "Rain",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
    id: propName(dom).rain,
    agg: "max", // todo
  };

  static TARIF: ISensor = {
    col: propName(dom).tarif,
    unit: "",
    fix: 0,
    range: 1,
    couldBeNegative: false,
    table: "dom",
    label: "Tarif",
    col2: "",
    chartType: "",
    color: MY_COLORS.yellow,
    id: propName(dom).tarif,
    agg: "max", // todo
  };

  static ROOM: ISensor = {
    col: "temp",
    unit: "",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "",
    label: "",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: "temp",
    agg: "avg",
  };

  static LIVING_ROOM_AIR: ISensor = {
    col: propName(dom).living_room_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room air",
    col2: propName(dom).living_room_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_air,
    agg: "avg",
  };

  static LIVING_ROOM_FLOOR: ISensor = {
    col: propName(dom).living_room_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room floor",
    col2: propName(dom).living_room_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_floor,
    agg: "avg",
  };

  static LIVING_ROOM_REQALL: ISensor = {
    col: propName(dom).living_room_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_reqall,
    agg: "avg",
  };

  static LIVING_ROOM_HEAT: ISensor = {
    col: propName(dom).living_room_heat,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room heat",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_heat,
    agg: "avg",
  };

  static LIVING_ROOM_OFF: ISensor = {
    col: propName(dom).living_room_off,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room off",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_off,
    agg: "avg",
  };

  static LIVING_ROOM_LOW: ISensor = {
    col: propName(dom).living_room_low,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room low",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_low,
    agg: "avg",
  };

  static GUEST_ROOM_AIR: ISensor = {
    col: propName(dom).guest_room_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room air",
    col2: propName(dom).guest_room_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_air,
    agg: "avg",
  };

  static GUEST_ROOM_FLOOR: ISensor = {
    col: propName(dom).guest_room_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room floor",
    col2: propName(dom).guest_room_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_floor,
    agg: "avg",
  };

  static GUEST_ROOM_REQALL: ISensor = {
    col: propName(dom).guest_room_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_reqall,
    agg: "avg",
  };

  static GUEST_ROOM_HEAT: ISensor = {
    col: propName(dom).guest_room_heat,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room heat",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_heat,
    agg: "avg",
  };

  static GUEST_ROOM_OFF: ISensor = {
    col: propName(dom).guest_room_off,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room off",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_off,
    agg: "avg",
  };

  static GUEST_ROOM_LOW: ISensor = {
    col: propName(dom).guest_room_low,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room low",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_low,
    agg: "avg",
  };

  static BED_ROOM_AIR: ISensor = {
    col: propName(dom).bed_room_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room air",
    col2: propName(dom).bed_room_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_air,
    agg: "avg",
  };

  static BED_ROOM_FLOOR: ISensor = {
    col: propName(dom).bed_room_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room floor",
    col2: propName(dom).bed_room_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_floor,
    agg: "avg",
  };

  static BED_ROOM_REQALL: ISensor = {
    col: propName(dom).bed_room_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_reqall,
    agg: "avg",
  };

  static BED_ROOM_HEAT: ISensor = {
    col: propName(dom).bed_room_heat,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room heat",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_heat,
    agg: "avg",
  };

  static BED_ROOM_OFF: ISensor = {
    col: propName(dom).bed_room_off,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room off",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_off,
    agg: "avg",
  };

  static BED_ROOM_LOW: ISensor = {
    col: propName(dom).bed_room_low,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room low",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_low,
    agg: "avg",
  };

  static BOYS_ROOM_AIR: ISensor = {
    col: propName(dom).boys_room_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room air",
    col2: propName(dom).boys_room_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_air,
    agg: "avg",
  };

  static BOYS_ROOM_FLOOR: ISensor = {
    col: propName(dom).boys_room_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room floor",
    col2: propName(dom).boys_room_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_floor,
    agg: "avg",
  };

  static BOYS_ROOM_REQALL: ISensor = {
    col: propName(dom).boys_room_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_reqall,
    agg: "avg",
  };

  static BOYS_ROOM_HEAT: ISensor = {
    col: propName(dom).boys_room_heat,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room heat",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_heat,
    agg: "avg",
  };

  static BOYS_ROOM_OFF: ISensor = {
    col: propName(dom).boys_room_off,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room off",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_off,
    agg: "avg",
  };

  static BOYS_ROOM_LOW: ISensor = {
    col: propName(dom).boys_room_low,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room low",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_low,
    agg: "avg",
  };

  static PETRA_ROOM_AIR: ISensor = {
    col: propName(dom).petra_room_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room air",
    col2: propName(dom).petra_room_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_air,
    agg: "avg",
  };

  static PETRA_ROOM_FLOOR: ISensor = {
    col: propName(dom).petra_room_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room floor",
    col2: propName(dom).petra_room_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_floor,
    agg: "avg",
  };

  static PETRA_ROOM_REQALL: ISensor = {
    col: propName(dom).petra_room_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_reqall,
    agg: "avg",
  };

  static PETRA_ROOM_HEAT: ISensor = {
    col: propName(dom).petra_room_heat,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room heat",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_heat,
    agg: "avg",
  };

  static PETRA_ROOM_OFF: ISensor = {
    col: propName(dom).petra_room_off,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room off",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_off,
    agg: "avg",
  };

  static PETRA_ROOM_LOW: ISensor = {
    col: propName(dom).petra_room_low,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room low",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_low,
    agg: "avg",
  };
}

export const DOM_SENSORS: ISensor[] = [
  DOM_SENSORS_DESC.TEMPERATURE,
  DOM_SENSORS_DESC.HUMIDITY,
  DOM_SENSORS_DESC.RAIN,
  DOM_SENSORS_DESC.TARIF,
  DOM_SENSORS_DESC.LIVING_ROOM_AIR,
  DOM_SENSORS_DESC.LIVING_ROOM_FLOOR,
  DOM_SENSORS_DESC.LIVING_ROOM_REQALL,
  DOM_SENSORS_DESC.LIVING_ROOM_HEAT,
  DOM_SENSORS_DESC.LIVING_ROOM_OFF,
  DOM_SENSORS_DESC.LIVING_ROOM_LOW,
  DOM_SENSORS_DESC.GUEST_ROOM_AIR,
  DOM_SENSORS_DESC.GUEST_ROOM_FLOOR,
  DOM_SENSORS_DESC.GUEST_ROOM_REQALL,
  DOM_SENSORS_DESC.GUEST_ROOM_HEAT,
  DOM_SENSORS_DESC.GUEST_ROOM_OFF,
  DOM_SENSORS_DESC.GUEST_ROOM_LOW,
  DOM_SENSORS_DESC.BED_ROOM_AIR,
  DOM_SENSORS_DESC.BED_ROOM_FLOOR,
  DOM_SENSORS_DESC.BED_ROOM_REQALL,
  DOM_SENSORS_DESC.BED_ROOM_HEAT,
  DOM_SENSORS_DESC.BED_ROOM_OFF,
  DOM_SENSORS_DESC.BED_ROOM_LOW,
  DOM_SENSORS_DESC.BOYS_ROOM_AIR,
  DOM_SENSORS_DESC.BOYS_ROOM_FLOOR,
  DOM_SENSORS_DESC.BOYS_ROOM_REQALL,
  DOM_SENSORS_DESC.BOYS_ROOM_HEAT,
  DOM_SENSORS_DESC.BOYS_ROOM_OFF,
  DOM_SENSORS_DESC.BOYS_ROOM_LOW,
  DOM_SENSORS_DESC.PETRA_ROOM_AIR,
  DOM_SENSORS_DESC.PETRA_ROOM_FLOOR,
  DOM_SENSORS_DESC.PETRA_ROOM_REQALL,
  DOM_SENSORS_DESC.PETRA_ROOM_HEAT,
  DOM_SENSORS_DESC.PETRA_ROOM_OFF,
  DOM_SENSORS_DESC.PETRA_ROOM_LOW,
];

export class DomCfg {
  TABLE = "dom";

  SOCKET_CHANNEL = "dom";

  SOCKET_TREND_CHANNEL = "dom-trend";

  REDIS_LAST_DATA_KEY = "dom-last";

  REDIS_MINUTE_DATA_KEY = "dom-minute-data";

  REDIS_TS_KEY = "dom-ts";

  KAFKA_STORE_TOPIC = `store`;

  KAFKA_DATA_TOPIC = `data`;

  REDIS_TREND_KEY = "dom-trend";

  KAFKA_KEY = "dom";

  STATION_ID = "dom";
}
