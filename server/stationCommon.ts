/* eslint-disable no-unused-vars */
import { StationCfg } from "../common/stationCfg";
import { IStationData, IStationTrendData } from "../common/stationModel";
import { IMeasurement } from "./measurement";

export default abstract class StationCommon implements IMeasurement {
  cfg: StationCfg = null;

  constructor(stationID: string) {
    this.cfg = new StationCfg(stationID);
  }

  abstract decodeData(data: any): { date: Date; decoded: {}; toStore: {} };

  getTables() {
    return [this.cfg.TABLE];
  }

  getColumns() {
    return this.cfg.COLUMNS;
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

  getRedisMinuteDataKey() {
    return this.cfg.REDIS_MINUTE_DATA_KEY;
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

  getQueryArray(_table: string, data: IStationData) {
    console.info(data);
    return [
      data.timestamp.toISOString(),
      data.tempin,
      data.humidityin,
      data.pressurerel,
      data.pressureabs,
      data.temp,
      data.humidity,
      data.winddir,
      data.windspeed,
      data.windgust,
      data.rainrate,
      data.solarradiation,
      data.uv,
      data.eventrain,
      data.hourlyrain,
      data.dailyrain,
      data.weeklyrain,
      data.monthlyrain,
    ];
  }

  getQueryText() {
    return `insert into ${this.cfg.TABLE}(timestamp, tempin, humidityin, pressurerel, pressureabs, temp, humidity, winddir, windspeed, windgust, rainrate, solarradiation, uv, eventrain, hourlyrain, dailyrain, weeklyrain, monthlyrain) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`;
  }

  transformTrendData(data: any) {
    const tmp = {} as IStationTrendData;
    tmp.timestamp = [];
    tmp.tempin = [];
    tmp.humidityin = [];
    tmp.temp = [];
    tmp.humidity = [];
    tmp.pressurerel = [];
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

  agregateMinuteDataFromKafka(minute: number, data: Array<IStationData>) {
    const deg2rad = (degrees: number) => degrees * (Math.PI / 180);

    const rad2deg = (radians: number) => radians * (180 / Math.PI);

    const round = (value: number, precision: number) => {
      const multiplier = 10 ** (precision || 0);
      return Math.round(value * multiplier) / multiplier;
    };

    const avgWind = (directions: number[]) => {
      let sinSum = 0;
      let cosSum = 0;
      directions.forEach((value) => {
        sinSum += Math.sin(deg2rad(value));
        cosSum += Math.cos(deg2rad(value));
      });
      return round((rad2deg(Math.atan2(sinSum, cosSum)) + 360) % 360, 0);
    };

    const initWithZeros = () => {
      const init: IStationData = {
        tempin: 0,
        temp: 0,
        pressurerel: 0,
        pressureabs: null, // todo
        windgust: 0,
        windspeed: 0,
        rainrate: 0,
        solarradiation: 0,
        uv: 0,
        humidityin: 0,
        humidity: 0,
        winddir: 0,
        timestamp: null,
        place: null,
        maxdailygust: null,
        eventrain: null,
        hourlyrain: null,
        dailyrain: null,
        weeklyrain: null,
        monthlyrain: null,
        totalrain: null,
        minuterain: null,
      };
      return init;
    };

    const sum = (value: IStationData[]) => {
      const total: IStationData = initWithZeros();

      for (const item of value) {
        total.timestamp = item.timestamp;
        total.tempin += item.tempin;
        total.humidityin += item.humidityin;
        total.temp += item.temp;
        total.humidity += item.humidity;
        total.pressurerel += item.pressurerel;
        // total.pressureabs += item.pressureabs;
        total.windgust += item.windgust;
        total.windspeed += item.windspeed;
        //        init.winddir += item.winddir;
        total.solarradiation += item.solarradiation;
        total.uv += item.uv;
        total.rainrate += item.rainrate;
        total.maxdailygust = item.maxdailygust;
        total.eventrain = item.eventrain;
        total.hourlyrain = item.hourlyrain;
        total.dailyrain = item.dailyrain;
        total.weeklyrain = item.weeklyrain;
        total.monthlyrain = item.monthlyrain;
        total.totalrain = item.totalrain;
        total.place = item.place;
      }
      return total;
    };

    const average = (total: IStationData, count: number) => {
      const avg = total;
      avg.tempin = round(total.tempin / count, 1);
      avg.temp = round(total.temp / count, 1);
      avg.pressurerel = round(total.pressurerel / count, 1);
      // avg.pressureabs = round(total.pressureabs / count, 1);
      avg.windgust = round(total.windgust / count, 1);
      avg.windspeed = round(total.windspeed / count, 1);
      avg.rainrate = round(total.rainrate / count, 1);
      avg.solarradiation = round(total.solarradiation / count, 0);
      avg.uv = round(total.uv / count, 0);
      avg.humidityin = round(total.humidityin / count, 0);
      avg.humidity = round(total.humidity / count, 0);
      avg.winddir = round(total.winddir / count, 0);
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
