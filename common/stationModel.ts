/* eslint-disable max-classes-per-file */
import { IMeasurementDesc } from "./measurementDesc";

export class StationCfg {
  TABLE = "stanica";

  COLUMNS = [
    "tempin",
    "humidityin",
    "pressurerel",
    "pressureabs",
    "temp",
    "humidity",
    "winddir",
    "windspeed",
    "windgust",
    "rainrate",
    "solarradiation",
    "uv",
    "eventrain",
    "hourlyrain",
  ];

  SOCKET_CHANNEL = "station";

  SOCKET_TREND_CHANNEL = "station-trend";

  REDIS_LAST_DATA_KEY = "station-last";

  REDIS_MINUTE_DATA_KEY = "station-minute-data";

  REDIS_STORE_CHANNEL = "station-store-pubsub";

  REDIS_TREND_KEY = "station-trend";
}

export interface IStationData {
  timestamp: string;
  time: string;
  date: string;
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
    yname: "temp",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: true,
    db: "stanica:temp",
    label: "Temperature",
  };

  static HUMIDITY: IMeasurementDesc = {
    yname: "humidity",
    unit: "%",
    fix: 0,
    range: 10,
    couldBeNegative: false,
    db: "stanica:humidity",
    label: "Humidity",
  };

  static TEMPERATUREIN: IMeasurementDesc = {
    yname: "tempin",
    unit: "°C",
    fix: 1,
    range: 1.6,
    couldBeNegative: true,
    db: "stanica:tempin",
    label: "Temperature IN",
  };

  static HUMIDITYIN: IMeasurementDesc = {
    yname: "humidityin",
    unit: "%",
    fix: 0,
    range: 10,
    couldBeNegative: false,
    db: "stanica:humidityin",
    label: "Humidity IN",
  };

  static PRESSURE: IMeasurementDesc = {
    yname: "pressurerel",
    unit: "hPa",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    db: "stanica:pressurerel",
    label: "Relative pressure",
  };

  static SOLAR: IMeasurementDesc = {
    yname: "solarradiation",
    unit: "W/m2",
    fix: 0,
    range: 100,
    couldBeNegative: false,
    db: "stanica:solarradiation",
    label: "Solar radiation",
  };

  static UV: IMeasurementDesc = {
    yname: "uv",
    unit: "",
    fix: 0,
    range: 3,
    couldBeNegative: false,
    db: "stanica:uv",
    label: "UV",
  };

  static RAINRATE: IMeasurementDesc = {
    yname: "rainrate",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    db: "stanica:rainrate",
    label: "Rain rate",
  };

  static EVENTRAIN: IMeasurementDesc = {
    yname: "eventrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    db: "stanica:eventrain",
    label: "Event rain",
  };

  static HOURLYRAIN: IMeasurementDesc = {
    yname: "hourlyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    db: "stanica:hourlyrain",
    label: "Hourly",
  };

  static DAILYRAIN: IMeasurementDesc = {
    yname: "dailyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    db: "stanica:dailyrain",
    label: "Daily",
  };

  static WEEKLYRAIN: IMeasurementDesc = {
    yname: "weeklyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    db: "stanica:weeklyrain",
    label: "Weekly",
  };

  static MONTHLYRAIN: IMeasurementDesc = {
    yname: "monthlyrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    db: "stanica:monthlyrain",
    label: "Monthly",
  };

  static TOTALRAIN: IMeasurementDesc = {
    yname: "totyalrain",
    unit: "mm",
    fix: 1,
    range: 1,
    couldBeNegative: false,
    db: "stanica:totalrain",
    label: "Total",
  };

  static WINDDIR: IMeasurementDesc = {
    yname: "winddir",
    unit: "°",
    fix: 0,
    range: 0,
    couldBeNegative: false,
    db: "stanica:winddir",
    label: "Wind dir",
  };

  static WINDSPEED: IMeasurementDesc = {
    yname: "windspeed",
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    db: "stanica:windspeed",
    label: "Wind speed",
  };

  static WINDGUST: IMeasurementDesc = {
    yname: "windgust",
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    db: "stanica:windgust",
    label: "Wind gust",
  };

  static DAILYGUST: IMeasurementDesc = {
    yname: "dailygust",
    unit: "km/h",
    fix: 1,
    range: 5,
    couldBeNegative: false,
    db: "stanica:dailygust",
    label: "Daily gust",
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
  STATION_MEASUREMENTS_DESC.TEMPERATUREIN,
  STATION_MEASUREMENTS_DESC.HUMIDITYIN,
];
