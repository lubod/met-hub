/* eslint-disable import/prefer-default-export */

export class StationCfg {
  STATION_ID: string;

  TABLE: string;

  SOCKET_CHANNEL: string;

  SOCKET_TREND_CHANNEL: string;

  REDIS_LAST_DATA_KEY: string;

  REDIS_MINUTE_DATA_KEY: string;

  REDIS_TS_KEY_PREFIX: string;

  KAFKA_STORE_TOPIC: string;

  KAFKA_DATA_TOPIC: string;

  REDIS_TREND_KEY: string;

  KAFKA_KEY: string;

  constructor(stationID: string) {
    this.STATION_ID = stationID;
    this.TABLE = `station_${this.STATION_ID}`;
    this.SOCKET_CHANNEL = `station_${this.STATION_ID}`;
    this.SOCKET_TREND_CHANNEL = `station_${this.STATION_ID}-trend`;
    this.REDIS_LAST_DATA_KEY = `station_${this.STATION_ID}-last`;
    this.REDIS_MINUTE_DATA_KEY = `station_${this.STATION_ID}-minute-data`;
    this.REDIS_TS_KEY_PREFIX = `station_${this.STATION_ID}-ts`;
    this.KAFKA_STORE_TOPIC = `store`;
    this.KAFKA_DATA_TOPIC = `data`;
    this.REDIS_TREND_KEY = `station_${this.STATION_ID}-trend`;
    this.KAFKA_KEY = `${this.STATION_ID}`;
  }
}
