/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */

import { STATION_MEASUREMENTS_DESC } from "./stationModel";

export class StationCfg {
  STATION_ID: string = null;

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

  TABLE: string = null;

  SOCKET_CHANNEL: string = null;

  SOCKET_TREND_CHANNEL: string = null;

  REDIS_LAST_DATA_KEY: string = null;

  REDIS_MINUTE_DATA_KEY: string = null;

  KAFKA_STORE_TOPIC: string = null;

  KAFKA_DATA_TOPIC: string = null;

  REDIS_TREND_KEY: string = null;

  KAFKA_KEY: string = null;

  constructor(stationID: string) {
    this.STATION_ID = stationID;
    this.TABLE = `station_${this.STATION_ID}`;
    this.SOCKET_CHANNEL = `station_${this.STATION_ID}`;
    this.SOCKET_TREND_CHANNEL = `station_${this.STATION_ID}-trend`;
    this.REDIS_LAST_DATA_KEY = `station_${this.STATION_ID}-last`;
    this.REDIS_MINUTE_DATA_KEY = `station_${this.STATION_ID}-minute-data`;
    this.KAFKA_STORE_TOPIC = `store`;
    this.KAFKA_DATA_TOPIC = `data`;
    this.REDIS_TREND_KEY = `station_${this.STATION_ID}-trend`;
    this.KAFKA_KEY = `${this.STATION_ID}`;
  }
}
