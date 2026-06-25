/* eslint-disable no-unused-vars */
import { StationCfg } from "../common/stationCfg";
import {
  IStationData,
  IStationTrendData,
  STATION_SENSORS,
} from "../common/stationModel";
import { deg2rad, rad2deg, round } from "../common/units";
import { IMeasurement } from "./measurement";

const AVERAGED_FIELDS: Array<{ key: keyof IStationData; precision: number }> = [
  { key: "tempin", precision: 1 },
  { key: "temp", precision: 1 },
  { key: "feelslike", precision: 1 },
  { key: "dewpt", precision: 1 },
  { key: "pressurerel", precision: 1 },
  { key: "pressureabs", precision: 1 },
  { key: "windgust", precision: 1 },
  { key: "windspeed", precision: 1 },
  { key: "rainrate", precision: 1 },
  { key: "solarradiation", precision: 0 },
  { key: "uv", precision: 0 },
  { key: "humidityin", precision: 0 },
  { key: "humidity", precision: 0 },
];

function avgWind(directions: number[], speeds: number[]) {
  let sinSum = 0;
  let cosSum = 0;
  let weightSum = 0;
  directions.forEach((value, index) => {
    const speed = speeds[index] || 1;
    sinSum += Math.sin(deg2rad(value)) * speed;
    cosSum += Math.cos(deg2rad(value)) * speed;
    weightSum += speed;
  });
  if (weightSum === 0) return 0;
  return round((rad2deg(Math.atan2(sinSum, cosSum)) + 360) % 360, 0);
}

export default abstract class StationCommon implements IMeasurement {
  cfg: StationCfg = null;

  constructor(stationID: string) {
    this.cfg = new StationCfg(stationID);
  }

  getStationID(): string {
    return this.cfg.STATION_ID;
  }

  abstract decodeData(
    data: any,
    place: string,
  ): {
    date: Date;
    decoded: IStationData;
    toStore: {};
  };

  abstract initWithZeros(): IStationData;

  getTables() {
    return [this.cfg.TABLE];
  }

  getSensors() {
    return STATION_SENSORS;
  }

  getSocketChannel() {
    return this.cfg.SOCKET_CHANNEL;
  }

  getSocketTrendChannel() {
    return this.cfg.SOCKET_TREND_CHANNEL;
  }

  getRedisLastDataKey() {
    return this.cfg.REDIS_LAST_DATA_KEY;
  }

  getRedisRawDataKey() {
    return this.cfg.REDIS_MINUTE_DATA_KEY;
  }

  getRedisTSKeyPrefix() {
    return this.cfg.REDIS_TS_KEY_PREFIX;
  }

  getKafkaStoreTopic() {
    return this.cfg.KAFKA_STORE_TOPIC;
  }

  getRedisTrendKey() {
    return this.cfg.REDIS_TREND_KEY;
  }

  getKafkaKey(): string {
    return this.cfg.KAFKA_KEY;
  }

  static parseDate(dateutc: string): Date {
    if (!dateutc || dateutc === "now") {
      return new Date();
    }
    const timestamp = new Date(`${dateutc} UTC`);
    if (isNaN(timestamp.getTime())) {
      return new Date();
    }
    return timestamp;
  }

  transformTrendData(data: any) {
    const tmp = {} as IStationTrendData;
    tmp.timestamp = [];
    tmp.tempin = [];
    tmp.humidityin = [];
    tmp.temp = [];
    tmp.humidity = [];
    tmp.pressurerel = [];
    tmp.pressureabs = [];
    tmp.windgust = [];
    tmp.windspeed = [];
    tmp.winddir = [];
    tmp.solarradiation = [];
    tmp.uv = [];
    tmp.rainrate = [];
    tmp.feelslike = [];
    tmp.dewpt = [];
    let prev = 0;
    data.forEach((item: any) => {
      const value: IStationData = JSON.parse(item);
      value.timestamp = new Date(value.timestamp);
      const time = value.timestamp.getTime();
      if (time - prev >= 60000) {
        tmp.timestamp.push(value.timestamp);
        tmp.tempin.push(value.tempin);
        tmp.humidityin.push(value.humidityin);
        tmp.temp.push(value.temp);
        tmp.humidity.push(value.humidity);
        tmp.pressurerel.push(value.pressurerel);
        tmp.pressureabs.push(value.pressureabs);
        tmp.windgust.push(value.windgust);
        tmp.windspeed.push(value.windspeed);
        tmp.winddir.push(value.winddir);
        tmp.solarradiation.push(value.solarradiation);
        tmp.uv.push(value.uv);
        tmp.rainrate.push(value.rainrate);
        tmp.feelslike.push(value.feelslike);
        tmp.dewpt.push(value.dewpt);
        prev = time;
      }
    });
    return tmp;
  }

  aggregateRawData2Minute(minute: number, data: Array<IStationData>): IStationData | null {
    if (data.length === 0) return null;

    const lastItem = data[data.length - 1];
    const result: IStationData = this.initWithZeros();

    result.timestamp = new Date(minute);
    result.place = lastItem.place;
    result.maxdailygust = lastItem.maxdailygust;
    result.eventrain = lastItem.eventrain;
    result.hourlyrain = lastItem.hourlyrain;
    result.dailyrain = lastItem.dailyrain;
    result.weeklyrain = lastItem.weeklyrain;
    result.monthlyrain = lastItem.monthlyrain;
    result.totalrain = lastItem.totalrain;

    for (const field of AVERAGED_FIELDS) {
      let sum = 0;
      let count = 0;
      for (const item of data) {
        const val = item[field.key];
        if (val != null && !isNaN(val as number)) {
          sum += val as number;
          count++;
        }
      }
      if (count > 0) {
        result[field.key] = round(sum / count, field.precision);
      } else {
        result[field.key] = null as any;
      }
    }

    const windDir: number[] = [];
    const windSpeed: number[] = [];
    data.forEach((element: IStationData) => {
      if (element.winddir != null && !isNaN(element.winddir) && element.windspeed != null && !isNaN(element.windspeed)) {
        windDir.push(element.winddir);
        windSpeed.push(element.windspeed);
      }
    });
    result.winddir = avgWind(windDir, windSpeed);
    console.info("Aggregated station minute", result.timestamp, result.place);
    return result;
  }
}
