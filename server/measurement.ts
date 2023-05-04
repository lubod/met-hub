/* eslint-disable no-unused-vars */
export interface IMeasurement {
  getSocketChannel(): string;

  getSocketTrendChannel(): string;

  getRedisLastDataKey(): string;

  getRedisMinuteDataKey(): string;

  getKafkaStoreTopic(): string;

  getRedisTrendKey(): string;

  getQueryArray(table: string, data: any): (string | number)[];

  getQueryText(table: string): string;

  getTables(): string[];

  getColumns(): string[];

  transformTrendData(data: any): {};

  decodeData(data: any): { date: Date; decoded: {}; toStore: {} };

  getKafkaKey(): string;

  agregateMinuteDataFromKafka(minute: number, data: any): any;

  getStationID(): string;
}
