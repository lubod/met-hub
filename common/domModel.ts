/* eslint-disable max-classes-per-file */
import MY_COLORS from "./colors";
import { IMeasurementDesc } from "./measurementDesc";

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
  timestamp: string;
  place: string;
  temp: number;
  humidity: number;
  rain: number;
  obyvacka_vzduch: number;
  obyvacka_podlaha: number;
  obyvacka_reqall: number;
  obyvacka_kuri: number;
  obyvacka_leto: number;
  obyvacka_low: number;
  pracovna_vzduch: number;
  pracovna_podlaha: number;
  pracovna_reqall: number;
  pracovna_kuri: number;
  pracovna_leto: number;
  pracovna_low: number;
  spalna_vzduch: number;
  spalna_podlaha: number;
  spalna_reqall: number;
  spalna_kuri: number;
  spalna_leto: number;
  spalna_low: number;
  chalani_vzduch: number;
  chalani_podlaha: number;
  chalani_reqall: number;
  chalani_kuri: number;
  chalani_leto: number;
  chalani_low: number;
  petra_vzduch: number;
  petra_podlaha: number;
  petra_reqall: number;
  petra_kuri: number;
  petra_leto: number;
  petra_low: number;
}

export interface IDomTrendData {
  timestamp: Array<string>;
  temp: Array<number>;
  humidity: Array<number>;
  rain: Array<number>;
  obyvacka_vzduch: Array<number>;
  obyvacka_podlaha: Array<number>;
  pracovna_vzduch: Array<number>;
  pracovna_podlaha: Array<number>;
  spalna_vzduch: Array<number>;
  spalna_podlaha: Array<number>;
  chalani_vzduch: Array<number>;
  chalani_podlaha: Array<number>;
  petra_vzduch: Array<number>;
  petra_podlaha: Array<number>;
}

export class DOM_MEASUREMENTS_DESC {
  static TEMPERATURE: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: true,
    table: "vonku",
    label: "Temperature",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static HUMIDITY: IMeasurementDesc = {
    col: "humidity",
    unit: "%",
    fix: 0,
    range: 10,
    couldBeNegative: false,
    table: "vonku",
    label: "Humidity",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static RAIN: IMeasurementDesc = {
    col: "rain",
    unit: "",
    fix: 0,
    range: 1,
    couldBeNegative: false,
    table: "vonku",
    label: "Rain",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static ROOM: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "",
    label: "",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static LIVING_ROOM_AIR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "obyvacka_vzduch",
    label: "Living room air",
    col2: "reqall",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static LIVING_ROOM_FLOOR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "obyvacka_podlaha",
    label: "Living room floor",
    col2: "kuri",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static GUEST_ROOM_AIR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "pracovna_vzduch",
    label: "Guest room air",
    col2: "reqall",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static GUEST_ROOM_FLOOR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "pracovna_podlaha",
    label: "Guest room floor",
    col2: "kuri",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static BED_ROOM_AIR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "spalna_vzduch",
    label: "Bed room air",
    col2: "reqall",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static BED_ROOM_FLOOR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "spalna_podlaha",
    label: "Bed room floor",
    col2: "kuri",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static BOYS_ROOM_AIR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "chalani_vzduch",
    label: "Boys room air",
    col2: "reqall",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static BOYS_ROOM_FLOOR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "chalani_podlaha",
    label: "Boys room floor",
    col2: "kuri",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static PETRA_ROOM_AIR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "petra_vzduch",
    label: "Petra room air",
    col2: "reqall",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static PETRA_ROOM_FLOOR: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "petra_podlaha",
    label: "Petra room floor",
    col2: "kuri",
    chartType: "",
    color: MY_COLORS.orange,
  };
}

export const DOM_MEASUREMENTS: IMeasurementDesc[] = [
  DOM_MEASUREMENTS_DESC.TEMPERATURE,
  DOM_MEASUREMENTS_DESC.HUMIDITY,
  DOM_MEASUREMENTS_DESC.RAIN,
  DOM_MEASUREMENTS_DESC.LIVING_ROOM_AIR,
  DOM_MEASUREMENTS_DESC.LIVING_ROOM_FLOOR,
  DOM_MEASUREMENTS_DESC.GUEST_ROOM_AIR,
  DOM_MEASUREMENTS_DESC.GUEST_ROOM_FLOOR,
  DOM_MEASUREMENTS_DESC.BED_ROOM_AIR,
  DOM_MEASUREMENTS_DESC.BED_ROOM_FLOOR,
  DOM_MEASUREMENTS_DESC.BOYS_ROOM_AIR,
  DOM_MEASUREMENTS_DESC.BOYS_ROOM_FLOOR,
  DOM_MEASUREMENTS_DESC.PETRA_ROOM_AIR,
  DOM_MEASUREMENTS_DESC.PETRA_ROOM_FLOOR,
];

export class DomCfg {
  TABLE = "dom";

  COLUMNS = [
    "temp",
    "humidity",
    "rain",
    "tarif",
    "req",
    "reqall",
    "useroffset",
    "maxoffset",
    "kuri",
    "low",
    "leto",
  ];

  SOCKET_CHANNEL = "dom";

  SOCKET_TREND_CHANNEL = "dom-trend";

  REDIS_LAST_DATA_KEY = "dom-last";

  REDIS_MINUTE_DATA_KEY = "dom-minute-data";

  REDIS_STORE_CHANNEL = "dom-store-pubsub";

  REDIS_TREND_KEY = "dom-trend";

  KAFKA_TOPIC = "dom-topic";
}
