/* eslint-disable no-unused-vars */
export interface IMeasurement {

    getPasskey(): string;

    getSocketChannel(): string;

    getSocketTrendChannel(): string;

    getRedisLastDataKey(): string;

    getRedisMinuteDataKey(): string;

    getRedisStoreChannel(): string;

    getRedisTrendKey(): string;

    getQueryArray(table: string, data: any): (string | number)[];

    getQueryText(table: string): string;

    getTables(): string[];

    transformTrendData(data: any): {};

    decodeData(data: any): { date: Date, decoded: {}, toStore: {} };

    agregateMinuteData(data: any): any;
}
