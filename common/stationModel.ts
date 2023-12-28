/* eslint-disable max-classes-per-file */
import MY_COLORS from "./colors";
import { ISensor } from "./sensor";
import { propName } from "./units";

export interface IStationData {
  timestamp: Date;
  place: string;
  tempin: number;
  humidityin: number;
  temp: number;
  humidity: number;
  pressurerel: number;
  pressureabs: number;
  windgust: number;
  windspeed: number;
  winddir: number;
  maxdailygust: number;
  solarradiation: number;
  uv: number;
  rainrate: number;
  eventrain: number;
  hourlyrain: number;
  dailyrain: number;
  weeklyrain: number;
  monthlyrain: number;
  totalrain: number;
  minuterain: number;
  dewpt: number;
}

export interface IStationGarni1025ArcusDataRaw {
  ID: string;
  PASSWORD: string;
  action: string;
  realtime: string;
  rtfreq: number;
  dateutc: string;
  baromin: number;
  tempf: number;
  dewptf: number;
  humidity: number;
  windspeedmph: number;
  windgustmph: number;
  winddir: number;
  rainin: number;
  dailyrainin: number;
  solarradiation: number;
  UV: number;
  indoortempf: number;
  indoorhumidity: number;
}

export interface IStationGoGenMe3900DataRaw {
  PASSKEY: string;
  stationtype: string;
  dateutc: string;
  tempinf: number;
  humidityin: number;
  baromrelin: number;
  baromabsin: number;
  tempf: number;
  humidity: number;
  winddir: number;
  windspeedmph: number;
  windgustmph: number;
  maxdailygust: number;
  rainratein: number;
  eventrainin: number;
  hourlyrainin: number;
  dailyrainin: number;
  weeklyrainin: number;
  monthlyrainin: number;
  totalrainin: number;
  solarradiation: number;
  uv: number;
  wh65batt: number;
  freq: string;
  model: string;
}

export interface IStationTrendData {
  timestamp: Array<Date>;
  tempin: Array<number>;
  humidityin: Array<number>;
  temp: Array<number>;
  humidity: Array<number>;
  pressurerel: Array<number>;
  pressureabs: Array<number>;
  windgust: Array<number>;
  windspeed: Array<number>;
  winddir: Array<number>;
  solarradiation: Array<number>;
  uv: Array<number>;
  rainrate: Array<number>;
  minuterain: Array<number>;
}

const station = {} as IStationData;

export class STATION_MEASUREMENTS_DESC {
  static TEMPERATURE: ISensor = {
    col: propName(station).temp,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: true,
    table: "station",
    label: "Temp",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(station).temp,
    agg: "avg",
  };

  static HUMIDITY: ISensor = {
    col: propName(station).humidity,
    unit: "%",
    fix: 0,
    range: 10,
    couldBeNegative: false,
    table: "station",
    label: "Humidity",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
    id: propName(station).humidity,
    agg: "avg",
  };

  static TEMPERATUREIN: ISensor = {
    col: propName(station).tempin,
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: true,
    table: "station",
    label: "Temperature IN",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
    id: propName(station).tempin,
    agg: "avg",
  };

  static HUMIDITYIN: ISensor = {
    col: propName(station).humidityin,
    unit: "%",
    fix: 0,
    range: 10,
    couldBeNegative: false,
    table: "station",
    label: "Humidity IN",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
    id: propName(station).humidityin,
    agg: "avg",
  };

  static PRESSUREABS: ISensor = {
    col: propName(station).pressureabs,
    unit: "hP",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Pressure",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
    id: propName(station).pressureabs,
    agg: "avg",
  };

  static PRESSUREREL: ISensor = {
    col: propName(station).pressurerel,
    unit: "hP",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Pressure",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
    id: propName(station).pressurerel,
    agg: "avg",
  };

  static SOLAR: ISensor = {
    col: propName(station).solarradiation,
    unit: "W/m2",
    fix: 0,
    range: 100,
    couldBeNegative: false,
    table: "station",
    label: "Solar",
    col2: "",
    chartType: "",
    color: MY_COLORS.yellow,
    id: propName(station).solarradiation,
    agg: "avg",
  };

  static UV: ISensor = {
    col: propName(station).uv,
    unit: "",
    fix: 0,
    range: 3,
    couldBeNegative: false,
    table: "station",
    label: "UV",
    col2: "",
    chartType: "",
    color: MY_COLORS.yellow,
    id: propName(station).uv,
    agg: "avg",
  };

  static RAINRATE: ISensor = {
    col: propName(station).rainrate,
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Rain",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
    id: propName(station).rainrate,
    agg: "avg",
  };

  static EVENTRAIN: ISensor = {
    col: propName(station).eventrain,
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Event rain",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
    id: propName(station).eventrain,
    agg: "max",
  };

  static HOURLYRAIN: ISensor = {
    col: propName(station).hourlyrain,
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Hourly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.blue,
    id: propName(station).hourlyrain,
    agg: "max",
  };

  static DAILYRAIN: ISensor = {
    col: propName(station).dailyrain,
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Daily",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.blue,
    id: propName(station).dailyrain,
    agg: "max",
  };

  static WEEKLYRAIN: ISensor = {
    col: propName(station).weeklyrain,
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Weekly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.blue,
    id: propName(station).weeklyrain,
    agg: "max",
  };

  static MONTHLYRAIN: ISensor = {
    col: propName(station).monthlyrain,
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Monthly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.blue,
    id: propName(station).monthlyrain,
    agg: "max",
  };

  static TOTALRAIN: ISensor = {
    col: propName(station).totalrain,
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Total",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
    id: propName(station).totalrain,
    agg: "max",
  };

  static WINDDIR: ISensor = {
    col: propName(station).winddir,
    unit: "°",
    fix: 0,
    range: 0,
    couldBeNegative: false,
    table: "station",
    label: "Wind dir",
    col2: "",
    chartType: "winddir",
    color: MY_COLORS.purple,
    id: propName(station).winddir,
    agg: "vavg",
  };

  static WINDSPEED: ISensor = {
    col: propName(station).windspeed,
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    table: "station",
    label: "Speed",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
    id: propName(station).windspeed,
    agg: "avg",
  };

  static WINDGUST: ISensor = {
    col: propName(station).windgust,
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    table: "station",
    label: "Gust",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
    id: propName(station).windgust,
    agg: "avg",
  };

  static MAXDAILYGUST: ISensor = {
    col: propName(station).maxdailygust,
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    table: "station",
    label: "Daily",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
    id: propName(station).maxdailygust,
    agg: "max",
  };
}

export const STATION_SENSORS: ISensor[] = [
  STATION_MEASUREMENTS_DESC.WINDDIR,
  STATION_MEASUREMENTS_DESC.WINDSPEED,
  STATION_MEASUREMENTS_DESC.WINDGUST,
  STATION_MEASUREMENTS_DESC.MAXDAILYGUST,
  STATION_MEASUREMENTS_DESC.TEMPERATURE,
  STATION_MEASUREMENTS_DESC.HUMIDITY,
  STATION_MEASUREMENTS_DESC.PRESSUREABS,
  STATION_MEASUREMENTS_DESC.PRESSUREREL,
  STATION_MEASUREMENTS_DESC.SOLAR,
  STATION_MEASUREMENTS_DESC.UV,
  STATION_MEASUREMENTS_DESC.RAINRATE,
  STATION_MEASUREMENTS_DESC.EVENTRAIN,
  STATION_MEASUREMENTS_DESC.HOURLYRAIN,
  STATION_MEASUREMENTS_DESC.DAILYRAIN,
  STATION_MEASUREMENTS_DESC.WEEKLYRAIN,
  STATION_MEASUREMENTS_DESC.MONTHLYRAIN,
  STATION_MEASUREMENTS_DESC.TOTALRAIN,
  STATION_MEASUREMENTS_DESC.TEMPERATUREIN,
  STATION_MEASUREMENTS_DESC.HUMIDITYIN,
];
