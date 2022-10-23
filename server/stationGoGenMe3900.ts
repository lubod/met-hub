import { StationCfg } from "../common/stationCfg";
import {
  IStationData,
  IStationGoGenMe3900DataRaw,
  IStationTrendData,
} from "../common/stationModel";
import { IMeasurement } from "./measurement";

class StationGoGenMe3900 implements IMeasurement {
  cfg: StationCfg = null;

  constructor(stationID: string) {
    this.cfg = new StationCfg(stationID);
  }

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

  getRedisStoreChannel() {
    return this.cfg.REDIS_STORE_CHANNEL;
  }

  getRedisTrendKey() {
    return this.cfg.REDIS_TREND_KEY;
  }

  getQueryArray(table: string, data: IStationData) {
    return [
      data.timestamp,
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

  decodeData(data: IStationGoGenMe3900DataRaw) {
    const TO_MM = 25.4;
    const TO_KM = 1.6;
    const TO_HPA = 33.8639;

    function round(value: number, precision: number) {
      const multiplier = 10 ** (precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    //    console.log(data)
    const decoded: IStationData = {
      timestamp: new Date(`${data.dateutc} UTC`).toISOString(),
      tempin: round((5 / 9) * (data.tempinf - 32), 1),
      pressurerel: round(data.baromrelin * TO_HPA, 1),
      pressureabs: round(data.baromabsin * TO_HPA, 1),
      temp: round((5 / 9) * (data.tempf - 32), 1),
      windspeed: round(data.windspeedmph * TO_KM, 1),
      windgust: round(data.windgustmph * TO_KM, 1),
      maxdailygust: round(data.maxdailygust * TO_KM, 1),
      rainrate: round(data.rainratein * TO_MM, 1),
      eventrain: round(data.eventrainin * TO_MM, 1),
      hourlyrain: round(data.hourlyrainin * TO_MM, 1),
      dailyrain: round(data.dailyrainin * TO_MM, 1),
      weeklyrain: round(data.weeklyrainin * TO_MM, 1),
      monthlyrain: round(data.monthlyrainin * TO_MM, 1),
      totalrain: round(data.totalrainin * TO_MM, 1),
      solarradiation: round(data.solarradiation * 1.0, 0),
      uv: round(data.uv * 1.0, 0),
      humidity: round(data.humidity * 1.0, 0),
      humidityin: round(data.humidityin * 1.0, 0),
      winddir: round(data.winddir * 1.0, 0),
      place: "Marianka",
      minuterain: null,
    };
    const date = new Date(decoded.timestamp);
    const toStore = decoded;
    return { date, decoded, toStore };
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
      const date = new Date(value.timestamp);
      const time = date.getTime();
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

  agregateMinuteData(data: any) {
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
        pressureabs: 0,
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
        total.pressureabs += item.pressureabs;
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
      avg.pressureabs = round(total.pressureabs / count, 1);
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

    const map = new Map();

    data.forEach((item: any) => {
      const sdata: IStationData = JSON.parse(item);
      const sdate = new Date(sdata.timestamp);
      const minute = sdate.getTime() - (sdate.getTime() % 60000);
      if (map.has(minute)) {
        const mdata = map.get(minute);
        mdata.push(sdata);
      } else {
        const mdata = [sdata];
        map.set(minute, mdata);
      }
    });

    const result = new Map();

    map.forEach((value, key) => {
      const minute = new Date(key);
      const date = minute.toISOString();
      // console.log(key, date, value);
      const s = sum(value);
      const avg = average(s, value.length);
      avg.timestamp = date;
      const windDir: number[] = [];
      value.forEach((element: IStationData) => {
        windDir.push(element.winddir);
      });
      avg.winddir = avgWind(windDir);
      // console.info(avg);
      result.set(minute.getTime(), avg);
      console.info("Agregated station minute", minute);
    });
    return result;
  }
}

export default StationGoGenMe3900;