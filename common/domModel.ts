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

  // Secondary house circuits
  entry_hall_air?: number;
  entry_hall_floor?: number;
  entry_hall_reqall?: number;
  entry_hall_heat?: boolean;
  entry_hall_off?: boolean;
  entry_hall_low?: boolean;

  bath_down_air?: number;
  bath_down_floor?: number;
  bath_down_reqall?: number;
  bath_down_heat?: boolean;
  bath_down_off?: boolean;
  bath_down_low?: boolean;

  bath_up_air?: number;
  bath_up_floor?: number;
  bath_up_reqall?: number;
  bath_up_heat?: boolean;
  bath_up_off?: boolean;
  bath_up_low?: boolean;

  wardrobe_air?: number;
  wardrobe_floor?: number;
  wardrobe_reqall?: number;
  wardrobe_heat?: boolean;
  wardrobe_off?: boolean;
  wardrobe_low?: boolean;

  hall_up_air?: number;
  hall_up_floor?: number;
  hall_up_reqall?: number;
  hall_up_heat?: boolean;
  hall_up_off?: boolean;
  hall_up_low?: boolean;
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
  living_room_heat?: Array<boolean>;
  guest_room_heat?: Array<boolean>;
  bed_room_heat?: Array<boolean>;
  boys_room_heat?: Array<boolean>;
  petra_room_heat?: Array<boolean>;

  entry_hall_air?: Array<number>;
  entry_hall_floor?: Array<number>;
  entry_hall_heat?: Array<boolean>;

  bath_down_air?: Array<number>;
  bath_down_floor?: Array<number>;
  bath_down_heat?: Array<boolean>;

  bath_up_air?: Array<number>;
  bath_up_floor?: Array<number>;
  bath_up_heat?: Array<boolean>;

  wardrobe_air?: Array<number>;
  wardrobe_floor?: Array<number>;
  wardrobe_heat?: Array<boolean>;

  hall_up_air?: Array<number>;
  hall_up_floor?: Array<number>;
  hall_up_heat?: Array<boolean>;
}

export interface IDomRoomHeatingInfo {
  id: string;
  name: string;
  slovakName: string;
  areaM2: number;
  heatedAreaM2: number;
  defaultPowerKw: number;
  level: "down" | "up";
  airKey: keyof IDomData;
  floorKey: keyof IDomData;
  reqKey: keyof IDomData;
  heatKey: keyof IDomData;
  offKey: keyof IDomData;
  lowKey: keyof IDomData;
}

export const DOM_ROOM_HEATING_DEFAULTS: Record<string, IDomRoomHeatingInfo> = {
  living_room: {
    id: "living_room",
    name: "LIVING ROOM",
    slovakName: "Obývačka",
    areaM2: 42.14,
    heatedAreaM2: 39.6,
    defaultPowerKw: 2.254, // 2254 W
    level: "down",
    airKey: "living_room_air",
    floorKey: "living_room_floor",
    reqKey: "living_room_reqall",
    heatKey: "living_room_heat",
    offKey: "living_room_off",
    lowKey: "living_room_low",
  },
  guest_room: {
    id: "guest_room",
    name: "GUEST ROOM",
    slovakName: "Hosťovská",
    areaM2: 12.44,
    heatedAreaM2: 12.4,
    defaultPowerKw: 0.665, // 665 W
    level: "down",
    airKey: "guest_room_air",
    floorKey: "guest_room_floor",
    reqKey: "guest_room_reqall",
    heatKey: "guest_room_heat",
    offKey: "guest_room_off",
    lowKey: "guest_room_low",
  },
  entry_hall: {
    id: "entry_hall",
    name: "ENTRY HALL",
    slovakName: "Vstupná chodba",
    areaM2: 6.36,
    heatedAreaM2: 6.2,
    defaultPowerKw: 0.329, // 329 W
    level: "down",
    airKey: "entry_hall_air",
    floorKey: "entry_hall_floor",
    reqKey: "entry_hall_reqall",
    heatKey: "entry_hall_heat",
    offKey: "entry_hall_off",
    lowKey: "entry_hall_low",
  },
  bath_down: {
    id: "bath_down",
    name: "BATHROOM DOWN",
    slovakName: "Kúpeľňa dole",
    areaM2: 4.41,
    heatedAreaM2: 3.2,
    defaultPowerKw: 0.506, // 506 W
    level: "down",
    airKey: "bath_down_air",
    floorKey: "bath_down_floor",
    reqKey: "bath_down_reqall",
    heatKey: "bath_down_heat",
    offKey: "bath_down_off",
    lowKey: "bath_down_low",
  },
  boys_room: {
    id: "boys_room",
    name: "BOYS",
    slovakName: "Chalani",
    areaM2: 21.26,
    heatedAreaM2: 21.2,
    defaultPowerKw: 0.984, // 984 W
    level: "up",
    airKey: "boys_room_air",
    floorKey: "boys_room_floor",
    reqKey: "boys_room_reqall",
    heatKey: "boys_room_heat",
    offKey: "boys_room_off",
    lowKey: "boys_room_low",
  },
  petra_room: {
    id: "petra_room",
    name: "PETRA",
    slovakName: "Petra",
    areaM2: 14.59,
    heatedAreaM2: 14.5,
    defaultPowerKw: 0.672, // 672 W
    level: "up",
    airKey: "petra_room_air",
    floorKey: "petra_room_floor",
    reqKey: "petra_room_reqall",
    heatKey: "petra_room_heat",
    offKey: "petra_room_off",
    lowKey: "petra_room_low",
  },
  bed_room: {
    id: "bed_room",
    name: "BED ROOM",
    slovakName: "Spálňa",
    areaM2: 13,
    heatedAreaM2: 12.4,
    defaultPowerKw: 0.577, // 577 W
    level: "up",
    airKey: "bed_room_air",
    floorKey: "bed_room_floor",
    reqKey: "bed_room_reqall",
    heatKey: "bed_room_heat",
    offKey: "bed_room_off",
    lowKey: "bed_room_low",
  },
  bath_up: {
    id: "bath_up",
    name: "BATHROOM UP",
    slovakName: "Kúpeľňa hore",
    areaM2: 6.36,
    heatedAreaM2: 3.5,
    defaultPowerKw: 0.541, // 541 W
    level: "up",
    airKey: "bath_up_air",
    floorKey: "bath_up_floor",
    reqKey: "bath_up_reqall",
    heatKey: "bath_up_heat",
    offKey: "bath_up_off",
    lowKey: "bath_up_low",
  },
  wardrobe: {
    id: "wardrobe",
    name: "WARDROBE",
    slovakName: "Šatník",
    areaM2: 4.6,
    heatedAreaM2: 4.5,
    defaultPowerKw: 0.132, // 132 W
    level: "up",
    airKey: "wardrobe_air",
    floorKey: "wardrobe_floor",
    reqKey: "wardrobe_reqall",
    heatKey: "wardrobe_heat",
    offKey: "wardrobe_off",
    lowKey: "wardrobe_low",
  },
  hall_up: {
    id: "hall_up",
    name: "HALL UP",
    slovakName: "Chodba hore",
    areaM2: 6.39,
    heatedAreaM2: 6.2,
    defaultPowerKw: 0.247, // 247 W
    level: "up",
    airKey: "hall_up_air",
    floorKey: "hall_up_floor",
    reqKey: "hall_up_reqall",
    heatKey: "hall_up_heat",
    offKey: "hall_up_off",
    lowKey: "hall_up_low",
  },
};

export interface IDomHeatingStatsInterval {
  totalKWh: number;
  totalRuntimeMinutes: number;
  rooms: Record<string, {
    runtimeMinutes: number;
    kwh: number;
    powerKw: number;
  }>;
}

export interface IDomHeatingStats {
  today: IDomHeatingStatsInterval;
  yesterday: IDomHeatingStatsInterval;
  last24h: IDomHeatingStatsInterval;
  last7d: IDomHeatingStatsInterval;
  last30d: IDomHeatingStatsInterval;
}

const dom = {} as Required<IDomData>;

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
    unit: "°C",
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
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_heat,
    agg: "max",
  };

  static LIVING_ROOM_OFF: ISensor = {
    col: propName(dom).living_room_off,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room off",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_off,
    agg: "max",
  };

  static LIVING_ROOM_LOW: ISensor = {
    col: propName(dom).living_room_low,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Living room low",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).living_room_low,
    agg: "max",
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
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_heat,
    agg: "max",
  };

  static GUEST_ROOM_OFF: ISensor = {
    col: propName(dom).guest_room_off,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room off",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_off,
    agg: "max",
  };

  static GUEST_ROOM_LOW: ISensor = {
    col: propName(dom).guest_room_low,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Guest room low",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).guest_room_low,
    agg: "max",
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
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_heat,
    agg: "max",
  };

  static BED_ROOM_OFF: ISensor = {
    col: propName(dom).bed_room_off,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room off",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_off,
    agg: "max",
  };

  static BED_ROOM_LOW: ISensor = {
    col: propName(dom).bed_room_low,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bed room low",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).bed_room_low,
    agg: "max",
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
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_heat,
    agg: "max",
  };

  static BOYS_ROOM_OFF: ISensor = {
    col: propName(dom).boys_room_off,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room off",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_off,
    agg: "max",
  };

  static BOYS_ROOM_LOW: ISensor = {
    col: propName(dom).boys_room_low,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Boys room low",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).boys_room_low,
    agg: "max",
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
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_heat,
    agg: "max",
  };

  static PETRA_ROOM_OFF: ISensor = {
    col: propName(dom).petra_room_off,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room off",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_off,
    agg: "max",
  };

  static PETRA_ROOM_LOW: ISensor = {
    col: propName(dom).petra_room_low,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Petra room low",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).petra_room_low,
    agg: "max",
  };

  static ENTRY_HALL_AIR: ISensor = {
    col: propName(dom).entry_hall_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Entry hall air",
    col2: propName(dom).entry_hall_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).entry_hall_air,
    agg: "avg",
  };

  static ENTRY_HALL_FLOOR: ISensor = {
    col: propName(dom).entry_hall_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Entry hall floor",
    col2: propName(dom).entry_hall_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).entry_hall_floor,
    agg: "avg",
  };

  static ENTRY_HALL_REQALL: ISensor = {
    col: propName(dom).entry_hall_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Entry hall reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).entry_hall_reqall,
    agg: "avg",
  };

  static ENTRY_HALL_HEAT: ISensor = {
    col: propName(dom).entry_hall_heat,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Entry hall heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).entry_hall_heat,
    agg: "max",
  };

  static BATH_DOWN_AIR: ISensor = {
    col: propName(dom).bath_down_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bathroom down air",
    col2: propName(dom).bath_down_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bath_down_air,
    agg: "avg",
  };

  static BATH_DOWN_FLOOR: ISensor = {
    col: propName(dom).bath_down_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bathroom down floor",
    col2: propName(dom).bath_down_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bath_down_floor,
    agg: "avg",
  };

  static BATH_DOWN_REQALL: ISensor = {
    col: propName(dom).bath_down_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bathroom down reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bath_down_reqall,
    agg: "avg",
  };

  static BATH_DOWN_HEAT: ISensor = {
    col: propName(dom).bath_down_heat,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bathroom down heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).bath_down_heat,
    agg: "max",
  };

  static BATH_UP_AIR: ISensor = {
    col: propName(dom).bath_up_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bathroom up air",
    col2: propName(dom).bath_up_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bath_up_air,
    agg: "avg",
  };

  static BATH_UP_FLOOR: ISensor = {
    col: propName(dom).bath_up_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bathroom up floor",
    col2: propName(dom).bath_up_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bath_up_floor,
    agg: "avg",
  };

  static BATH_UP_REQALL: ISensor = {
    col: propName(dom).bath_up_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bathroom up reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).bath_up_reqall,
    agg: "avg",
  };

  static BATH_UP_HEAT: ISensor = {
    col: propName(dom).bath_up_heat,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Bathroom up heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).bath_up_heat,
    agg: "max",
  };

  static WARDROBE_AIR: ISensor = {
    col: propName(dom).wardrobe_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Wardrobe air",
    col2: propName(dom).wardrobe_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).wardrobe_air,
    agg: "avg",
  };

  static WARDROBE_FLOOR: ISensor = {
    col: propName(dom).wardrobe_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Wardrobe floor",
    col2: propName(dom).wardrobe_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).wardrobe_floor,
    agg: "avg",
  };

  static WARDROBE_REQALL: ISensor = {
    col: propName(dom).wardrobe_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Wardrobe reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).wardrobe_reqall,
    agg: "avg",
  };

  static WARDROBE_HEAT: ISensor = {
    col: propName(dom).wardrobe_heat,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Wardrobe heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).wardrobe_heat,
    agg: "max",
  };

  static HALL_UP_AIR: ISensor = {
    col: propName(dom).hall_up_air,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Hall up air",
    col2: propName(dom).hall_up_reqall,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).hall_up_air,
    agg: "avg",
  };

  static HALL_UP_FLOOR: ISensor = {
    col: propName(dom).hall_up_floor,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Hall up floor",
    col2: propName(dom).hall_up_heat,
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).hall_up_floor,
    agg: "avg",
  };

  static HALL_UP_REQALL: ISensor = {
    col: propName(dom).hall_up_reqall,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Hall up reqall",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(dom).hall_up_reqall,
    agg: "avg",
  };

  static HALL_UP_HEAT: ISensor = {
    col: propName(dom).hall_up_heat,
    unit: "",
    fix: 0,
    range: 1.6,
    couldBeNegative: false,
    table: "dom",
    label: "Hall up heat",
    col2: "",
    chartType: "boolean",
    color: MY_COLORS.orange,
    id: propName(dom).hall_up_heat,
    agg: "max",
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
  DOM_SENSORS_DESC.GUEST_ROOM_AIR,
  DOM_SENSORS_DESC.GUEST_ROOM_FLOOR,
  DOM_SENSORS_DESC.GUEST_ROOM_REQALL,
  DOM_SENSORS_DESC.ENTRY_HALL_AIR,
  DOM_SENSORS_DESC.ENTRY_HALL_FLOOR,
  DOM_SENSORS_DESC.ENTRY_HALL_REQALL,
  DOM_SENSORS_DESC.BATH_DOWN_AIR,
  DOM_SENSORS_DESC.BATH_DOWN_FLOOR,
  DOM_SENSORS_DESC.BATH_DOWN_REQALL,
  DOM_SENSORS_DESC.BED_ROOM_AIR,
  DOM_SENSORS_DESC.BED_ROOM_FLOOR,
  DOM_SENSORS_DESC.BED_ROOM_REQALL,
  DOM_SENSORS_DESC.BOYS_ROOM_AIR,
  DOM_SENSORS_DESC.BOYS_ROOM_FLOOR,
  DOM_SENSORS_DESC.BOYS_ROOM_REQALL,
  DOM_SENSORS_DESC.PETRA_ROOM_AIR,
  DOM_SENSORS_DESC.PETRA_ROOM_FLOOR,
  DOM_SENSORS_DESC.PETRA_ROOM_REQALL,
  DOM_SENSORS_DESC.BATH_UP_AIR,
  DOM_SENSORS_DESC.BATH_UP_FLOOR,
  DOM_SENSORS_DESC.BATH_UP_REQALL,
  DOM_SENSORS_DESC.WARDROBE_AIR,
  DOM_SENSORS_DESC.WARDROBE_FLOOR,
  DOM_SENSORS_DESC.WARDROBE_REQALL,
  DOM_SENSORS_DESC.HALL_UP_AIR,
  DOM_SENSORS_DESC.HALL_UP_FLOOR,
  DOM_SENSORS_DESC.HALL_UP_REQALL,
  // Heat-state booleans are real PG columns on station_dom and are requested
  // as col2 overlays by the room-floor charts (measurement=floor:heat).
  DOM_SENSORS_DESC.LIVING_ROOM_HEAT,
  DOM_SENSORS_DESC.GUEST_ROOM_HEAT,
  DOM_SENSORS_DESC.ENTRY_HALL_HEAT,
  DOM_SENSORS_DESC.BATH_DOWN_HEAT,
  DOM_SENSORS_DESC.BED_ROOM_HEAT,
  DOM_SENSORS_DESC.BOYS_ROOM_HEAT,
  DOM_SENSORS_DESC.PETRA_ROOM_HEAT,
  DOM_SENSORS_DESC.BATH_UP_HEAT,
  DOM_SENSORS_DESC.WARDROBE_HEAT,
  DOM_SENSORS_DESC.HALL_UP_HEAT,
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
