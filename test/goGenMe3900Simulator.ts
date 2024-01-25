import axios from "axios";
import {
  IStationData,
  IStationGoGenMe3900DataRaw,
} from "../common/stationModel";
import { round, random } from "../common/units";
import { CSimulator } from "./simulator";

/*
{
  PASSKEY: '',
  stationtype: 'EasyWeatherV1.5.2',
  dateutc: '2021-04-06 08:42:00',
  tempinf: '74.1',
  humidityin: '62',
  baromrelin: '30.189',
  baromabsin: '29.442',
  tempf: '71.4',
  humidity: '72',
  winddir: '69',
  windspeedmph: '0.4',
  windgustmph: '1.1',
  maxdailygust: '3.4',
  rainratein: '0.000',
  eventrainin: '0.000',
  hourlyrainin: '0.000',
  dailyrainin: '0.000',
  weeklyrainin: '0.000',
  monthlyrainin: '0.201',
  totalrainin: '0.201',
  solarradiation: '19.45',
  uv: '0',
  wh65batt: '0',
  freq: '868M',
  model: 'WS2900_V2.01.10',
};
*/

// eslint-disable-next-line import/prefer-default-export
export class GoGenMe3900Simulator extends CSimulator {
  correctTimestamp() {}

  getPGData(decoded: any) {
    return {
      eventrain: decoded.eventrain.toFixed(1),
      hourlyrain: decoded.hourlyrain.toFixed(1),
      dailyrain: decoded.dailyrain.toFixed(1),
      weeklyrain: decoded.weeklyrain.toFixed(1),
      monthlyrain: decoded.monthlyrain.toFixed(1),
      humidity: decoded.humidity.toFixed(0),
      humidityin: decoded.humidityin.toFixed(0),
      pressureabs: decoded.pressureabs.toFixed(1),
      pressurerel: decoded.pressurerel.toFixed(1),
      rainrate: decoded.rainrate.toFixed(1),
      solarradiation: decoded.solarradiation.toFixed(1),
      temp: decoded.temp.toFixed(1),
      tempin: decoded.tempin.toFixed(1),
      timestamp: new Date(
        `${decoded.timestamp
          .toISOString()
          .substring(0, 17)}00${decoded.timestamp.toISOString().substring(19)}`,
      ),
      uv: decoded.uv.toFixed(0),
      winddir: decoded.winddir.toFixed(0),
      windgust: decoded.windgust.toFixed(1),
      windspeed: decoded.windspeed.toFixed(1),
    };
  }

  getClientStationData(data: any) {
    const csd: IStationData = {
      timestamp: data.timestamp,
      place: data.place,
      tempin: data.tempin,
      humidityin: data.humidityin,
      temp: data.temp,
      humidity: data.humidity,
      pressurerel: data.pressurerel,
      pressureabs: data.pressureabs,
      windgust: data.windgust,
      windspeed: data.windspeed,
      winddir: data.winddir,
      maxdailygust: data.maxdailygust,
      solarradiation: data.solarradiation,
      uv: data.uv,
      rainrate: data.rainrate,
      eventrain: data.eventrain,
      hourlyrain: data.hourlyrain,
      dailyrain: data.dailyrain,
      weeklyrain: data.weeklyrain,
      monthlyrain: data.monthlyrain,
      totalrain: data.totalrain,
      minuterain: data.minuterain,
      dewpt: data.dewpt,
    };
    return csd;
  }

  generateOffsetData(cdata: any, offset: number) {
    const data = {} as IStationGoGenMe3900DataRaw;
    data.PASSKEY = cdata.PASSKEY;
    data.stationtype = cdata.stationtype;
    data.wh65batt = cdata.wh65batt;
    data.freq = cdata.freq;
    data.model = cdata.model;
    data.dateutc = cdata.dateutc;
    data.tempinf = round(cdata.tempinf + offset, 1);
    data.humidityin = round(cdata.humidityin + offset, 0);
    data.baromrelin = round(cdata.baromrelin + offset, 3);
    data.baromabsin = round(cdata.baromabsin + offset, 3);
    data.tempf = round(cdata.tempf + offset, 1);
    data.humidity = round(cdata.humidity + offset, 0);
    data.winddir = round((cdata.winddir + offset) % 360, 0);
    data.windspeedmph = round(cdata.windspeedmph + offset, 1);
    data.windgustmph = round(cdata.windgustmph + offset, 1);
    data.maxdailygust = cdata.maxdailygust;
    data.rainratein = cdata.rainratein;
    data.eventrainin = cdata.eventrainin;
    data.hourlyrainin = cdata.hourlyrainin;
    data.dailyrainin = cdata.dailyrainin;
    data.weeklyrainin = cdata.weeklyrainin;
    data.monthlyrainin = cdata.monthlyrainin;
    data.totalrainin = cdata.totalrainin;
    data.solarradiation = round(cdata.solarradiation + offset, 2);
    data.uv = round(cdata.solarradiation / 100, 0);
    return data;
  }

  generateData(d: Date, PASSKEY: string) {
    d.setUTCMilliseconds(0);
    const data = {} as IStationGoGenMe3900DataRaw;
    data.PASSKEY = PASSKEY;
    data.stationtype = "EasyWeatherV1.5.2";
    data.wh65batt = 0;
    data.freq = "868M";
    data.model = "WS2900_V2.01.10";
    data.dateutc = d.toISOString().replace("T", " ").replace(".000Z", "");
    data.tempinf = round(random(60, 80), 1);
    data.humidityin = round(random(40, 60), 0);
    data.baromrelin = round(random(25, 35), 3);
    data.baromabsin = round(random(25, 35), 3);
    data.tempf = round(random(60, 80), 1);
    data.humidity = round(random(40, 60), 0);
    data.winddir = round(random(0, 359), 0);
    data.windspeedmph = round(random(0, 50), 1);
    data.windgustmph = round(random(data.windspeedmph, 60), 1);
    data.maxdailygust = round(random(data.windgustmph, 70), 1);
    data.rainratein = round(random(0, 1), 3);
    data.eventrainin = round(random(0, 0.5), 3);
    data.hourlyrainin = round(random(data.eventrainin, 0.7), 3);
    data.dailyrainin = round(random(data.hourlyrainin, 1), 3);
    data.weeklyrainin = round(random(data.dailyrainin, 1.4), 3);
    data.monthlyrainin = round(random(data.weeklyrainin, 1.8), 3);
    data.totalrainin = round(random(data.monthlyrainin, 10), 3);
    data.solarradiation = round(random(0, 1000), 2);
    data.uv = round(data.solarradiation / 100, 0);
    return data;
  }

  async postData(data: any) {
    try {
      await axios.post("http://localhost:18080/setData", data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
