/* eslint-disable max-classes-per-file */
import MY_COLORS from "./colors";
import { IMeasurementDesc } from "./measurementDesc";

export interface IStationData {
  timestamp: string;
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
  timestamp: Array<string>;
  tempin: Array<number>;
  humidityin: Array<number>;
  temp: Array<number>;
  humidity: Array<number>;
  pressurerel: Array<number>;
  windgust: Array<number>;
  windspeed: Array<number>;
  winddir: Array<number>;
  solarradiation: Array<number>;
  uv: Array<number>;
  rainrate: Array<number>;
  minuterain: Array<number>;
}

export class STATION_MEASUREMENTS_DESC {
  static TEMPERATURE: IMeasurementDesc = {
    col: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: true,
    table: "station",
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
    table: "station",
    label: "Humidity",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static TEMPERATUREIN: IMeasurementDesc = {
    col: "tempin",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: true,
    table: "station",
    label: "Temperature IN",
    col2: "",
    chartType: "",
    color: MY_COLORS.orange,
  };

  static HUMIDITYIN: IMeasurementDesc = {
    col: "humidityin",
    unit: "%",
    fix: 0,
    range: 10,
    couldBeNegative: false,
    table: "station",
    label: "Humidity IN",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static PRESSURE: IMeasurementDesc = {
    col: "pressurerel",
    unit: "hPa",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Pressure",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
  };

  static SOLAR: IMeasurementDesc = {
    col: "solarradiation",
    unit: "W/m2",
    fix: 0,
    range: 100,
    couldBeNegative: false,
    table: "station",
    label: "Solar",
    col2: "",
    chartType: "",
    color: MY_COLORS.yellow,
  };

  static UV: IMeasurementDesc = {
    col: "uv",
    unit: "",
    fix: 0,
    range: 3,
    couldBeNegative: false,
    table: "station",
    label: "UV",
    col2: "",
    chartType: "",
    color: MY_COLORS.yellow,
  };

  static RAINRATE: IMeasurementDesc = {
    col: "rainrate",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Rain rate",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
  };

  static EVENTRAIN: IMeasurementDesc = {
    col: "eventrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Event rain",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
  };

  static HOURLYRAIN: IMeasurementDesc = {
    col: "hourlyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Hourly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.purple,
  };

  static DAILYRAIN: IMeasurementDesc = {
    col: "dailyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Daily",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.purple,
  };

  static WEEKLYRAIN: IMeasurementDesc = {
    col: "weeklyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Weekly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.purple,
  };

  static MONTHLYRAIN: IMeasurementDesc = {
    col: "monthlyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Monthly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.purple,
  };

  static TOTALRAIN: IMeasurementDesc = {
    col: "totyalrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "station",
    label: "Total",
    col2: "",
    chartType: "",
    color: MY_COLORS.purple,
  };

  static WINDDIR: IMeasurementDesc = {
    col: "winddir",
    unit: "°",
    fix: 0,
    range: 0,
    couldBeNegative: false,
    table: "station",
    label: "Wind dir",
    col2: "",
    chartType: "winddir",
    color: MY_COLORS.blue,
  };

  static WINDSPEED: IMeasurementDesc = {
    col: "windspeed",
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    table: "station",
    label: "Wind speed",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static WINDGUST: IMeasurementDesc = {
    col: "windgust",
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    table: "station",
    label: "Wind gust",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static DAILYGUST: IMeasurementDesc = {
    col: "dailygust",
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    table: "station",
    label: "Daily gust",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };
}

export const STATION_MEASUREMENTS: IMeasurementDesc[] = [
  STATION_MEASUREMENTS_DESC.WINDDIR,
  STATION_MEASUREMENTS_DESC.WINDSPEED,
  STATION_MEASUREMENTS_DESC.WINDGUST,
  STATION_MEASUREMENTS_DESC.TEMPERATURE,
  STATION_MEASUREMENTS_DESC.HUMIDITY,
  STATION_MEASUREMENTS_DESC.PRESSURE,
  STATION_MEASUREMENTS_DESC.SOLAR,
  STATION_MEASUREMENTS_DESC.UV,
  STATION_MEASUREMENTS_DESC.RAINRATE,
  STATION_MEASUREMENTS_DESC.HOURLYRAIN,
  STATION_MEASUREMENTS_DESC.DAILYRAIN,
  STATION_MEASUREMENTS_DESC.WEEKLYRAIN,
  STATION_MEASUREMENTS_DESC.MONTHLYRAIN,
  STATION_MEASUREMENTS_DESC.TEMPERATUREIN,
  STATION_MEASUREMENTS_DESC.HUMIDITYIN,
];
