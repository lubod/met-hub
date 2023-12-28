/* eslint-disable no-unused-vars */
import { StationCfg } from "../common/stationCfg";
import {
  IStationData,
  IStationTrendData,
  STATION_SENSORS,
} from "../common/stationModel";
import { deg2rad, rad2deg, round } from "../common/units";
import { IMeasurement } from "./measurement";

export default abstract class StationCommon implements IMeasurement {
  cfg: StationCfg = null;

  constructor(stationID: string) {
    this.cfg = new StationCfg(stationID);
  }

  getStationID(): string {
    return this.cfg.STATION_ID;
  }

  abstract decodeData(data: any): {
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
        prev = time;
      }
    });
    return tmp;
  }

  agregateRawData2Minute(minute: number, data: Array<IStationData>) {
    const avgWind = (directions: number[]) => {
      let sinSum = 0;
      let cosSum = 0;
      directions.forEach((value) => {
        sinSum += Math.sin(deg2rad(value));
        cosSum += Math.cos(deg2rad(value));
      });
      return round((rad2deg(Math.atan2(sinSum, cosSum)) + 360) % 360, 0);
    };

    const sum = (value: IStationData[]) => {
      const total: IStationData = this.initWithZeros();

      for (const item of value) {
        if (total.timestamp != null) total.timestamp = item.timestamp;
        if (total.tempin != null) total.tempin += item.tempin;
        if (total.humidityin != null) total.humidityin += item.humidityin;
        if (total.temp != null) total.temp += item.temp;
        if (total.humidity != null) total.humidity += item.humidity;
        if (total.pressurerel != null) total.pressurerel += item.pressurerel;
        if (total.pressureabs != null) total.pressureabs += item.pressureabs;
        if (total.windgust != null) total.windgust += item.windgust;
        if (total.windspeed != null) total.windspeed += item.windspeed;
        if (total.solarradiation != null)
          total.solarradiation += item.solarradiation;
        if (total.uv != null) total.uv += item.uv;
        if (total.rainrate != null) total.rainrate += item.rainrate;
        if (total.maxdailygust != null) total.maxdailygust = item.maxdailygust;
        if (total.eventrain != null) total.eventrain = item.eventrain;
        if (total.hourlyrain != null) total.hourlyrain = item.hourlyrain;
        if (total.dailyrain != null) total.dailyrain = item.dailyrain;
        if (total.weeklyrain != null) total.weeklyrain = item.weeklyrain;
        if (total.monthlyrain != null) total.monthlyrain = item.monthlyrain;
        if (total.totalrain != null) total.totalrain = item.totalrain;
        if (total.place != null) total.place = item.place;
      }
      return total;
    };

    const average = (total: IStationData, count: number) => {
      const avg = total;
      if (total.tempin != null) avg.tempin = round(total.tempin / count, 1);
      if (total.temp != null) avg.temp = round(total.temp / count, 1);
      if (total.pressurerel != null)
        avg.pressurerel = round(total.pressurerel / count, 1);
      if (total.pressureabs != null)
        avg.pressureabs = round(total.pressureabs / count, 1);
      if (total.windgust != null)
        avg.windgust = round(total.windgust / count, 1);
      if (total.windspeed != null)
        avg.windspeed = round(total.windspeed / count, 1);
      if (total.rainrate != null)
        avg.rainrate = round(total.rainrate / count, 1);
      if (total.solarradiation != null)
        avg.solarradiation = round(total.solarradiation / count, 0);
      if (total.uv != null) avg.uv = round(total.uv / count, 0);
      if (total.humidityin != null)
        avg.humidityin = round(total.humidityin / count, 0);
      if (total.humidity != null)
        avg.humidity = round(total.humidity / count, 0);
      if (total.winddir != null) avg.winddir = round(total.winddir / count, 0);
      return avg;
    };

    const s = sum(data);
    const avg: IStationData = average(s, data.length);
    avg.timestamp = new Date(minute);
    const windDir: number[] = [];
    data.forEach((element: IStationData) => {
      windDir.push(element.winddir);
    });
    avg.winddir = avgWind(windDir);
    console.info("Agregated station minute", avg.place, minute);
    return avg;
  }
}
