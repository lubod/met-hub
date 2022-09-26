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

/*
curl --header "Content-Type: application/json" --request POST --data \
'{ "PASSKEY": "",
  "stationtype": "EasyWeatherV1.5.2",
  "dateutc": "2021-04-06 08:42:00",
  "tempinf": "74.1",
  "humidityin": "62",
  "baromrelin": "30.189",
  "baromabsin": "29.442",
  "tempf": "71.4",
  "humidity": "72",
  "winddir": "69",
  "windspeedmph": "0.4",
  "windgustmph": "1.1",
  "maxdailygust": "3.4",
  "rainratein": "0.000",
  "eventrainin": "0.000",
  "hourlyrainin": "0.000",
  "dailyrainin": "0.000",
  "weeklyrainin": "0.000",
  "monthlyrainin": "0.201",
  "totalrainin": "0.201",
  "solarradiation": "19.45",
  "uv": "0",
  "wh65batt": "0",
  "freq": "868M",
  "model": "WS2900_V2.01.10" }' \
  http://localhost:8082/setData
*/
export interface IStationDataRaw {
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
    table: "stanica",
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
    table: "stanica",
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
    table: "stanica",
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
    table: "stanica",
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
    table: "stanica",
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
    table: "stanica",
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
    table: "stanica",
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
    table: "stanica",
    label: "Rain rate",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static EVENTRAIN: IMeasurementDesc = {
    col: "eventrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "stanica",
    label: "Event rain",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static HOURLYRAIN: IMeasurementDesc = {
    col: "hourlyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "stanica",
    label: "Hourly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.blue,
  };

  static DAILYRAIN: IMeasurementDesc = {
    col: "dailyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "stanica",
    label: "Daily",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.blue,
  };

  static WEEKLYRAIN: IMeasurementDesc = {
    col: "weeklyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "stanica",
    label: "Weekly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.blue,
  };

  static MONTHLYRAIN: IMeasurementDesc = {
    col: "monthlyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "stanica",
    label: "Monthly",
    col2: "",
    chartType: "rain",
    color: MY_COLORS.blue,
  };

  static TOTALRAIN: IMeasurementDesc = {
    col: "totyalrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    table: "stanica",
    label: "Total",
    col2: "",
    chartType: "",
    color: MY_COLORS.blue,
  };

  static WINDDIR: IMeasurementDesc = {
    col: "winddir",
    unit: "°",
    fix: 0,
    range: 0,
    couldBeNegative: false,
    table: "stanica",
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
    table: "stanica",
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
    table: "stanica",
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
    table: "stanica",
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

export class StationCfg {
  TABLE = "stanica";

  COLUMNS = [
    STATION_MEASUREMENTS_DESC.TEMPERATUREIN.col,
    STATION_MEASUREMENTS_DESC.HUMIDITYIN.col,
    STATION_MEASUREMENTS_DESC.PRESSURE.col,
    "pressureabs", // todo
    STATION_MEASUREMENTS_DESC.TEMPERATURE.col,
    STATION_MEASUREMENTS_DESC.HUMIDITY.col,
    STATION_MEASUREMENTS_DESC.WINDDIR.col,
    STATION_MEASUREMENTS_DESC.WINDSPEED.col,
    STATION_MEASUREMENTS_DESC.WINDGUST.col,
    STATION_MEASUREMENTS_DESC.RAINRATE.col,
    STATION_MEASUREMENTS_DESC.SOLAR.col,
    STATION_MEASUREMENTS_DESC.UV.col,
    STATION_MEASUREMENTS_DESC.EVENTRAIN.col,
    STATION_MEASUREMENTS_DESC.HOURLYRAIN.col,
    STATION_MEASUREMENTS_DESC.DAILYRAIN.col,
    STATION_MEASUREMENTS_DESC.WEEKLYRAIN.col,
    STATION_MEASUREMENTS_DESC.MONTHLYRAIN.col,
  ];

  SOCKET_CHANNEL = "station";

  SOCKET_TREND_CHANNEL = "station-trend";

  REDIS_LAST_DATA_KEY = "station-last";

  REDIS_MINUTE_DATA_KEY = "station-minute-data";

  REDIS_STORE_CHANNEL = "station-store-pubsub";

  REDIS_TREND_KEY = "station-trend";
}
