import { IDomData } from "../common/domModel";
import { ISensor } from "../common/sensor";
import { IStationData } from "../common/stationModel";

/* eslint-disable no-unused-vars */
export interface IMeasurement {
  getSocketChannel(): string;

  getSocketTrendChannel(): string;

  getRedisLastDataKey(): string;

  getRedisRawDataKey(): string;

  getRedisTSKeyPrefix(): string;

  getKafkaStoreTopic(): string;

  getRedisTrendKey(): string;

  getTables(): string[];

  getSensors(): ISensor[];

  transformTrendData(data: any): {};

  decodeData(
    data: any,
    place: string,
  ): {
    date: Date;
    decoded: IDomData | IStationData;
  };

  getKafkaKey(): string;

  agregateRawData2Minute(minute: number, data: any): any;

  getStationID(): string;
}
