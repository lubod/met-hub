import fetch from "node-fetch";
import {
  IStationData,
  IStationGarni1025ArcusDataRaw,
} from "../common/stationModel";
import { round, random } from "../common/units";
import { CSimulator } from "./simulator";
import { IDomData } from "../common/domModel";

/*
     {
   ID: '',
   PASSWORD: '',
   action: 'updateraww',
   realtime: '1',
   rtfreq: '5',
   dateutc: 'now',
   baromin: '29.94',
   tempf: '73.5',
   dewptf: '63.5',
   humidity: '71',
   windspeedmph: '0.0',
   windgustmph: '0.0',
   winddir: '6',
   rainin: '0.0',
   dailyrainin: '0.0',
   solarradiation: '0.39',
   UV: '0.0',
   indoortempf: '72.8',
   indoorhumidity: '69'
 }
*/
// curl -X GET "localhost:8082/ID=&PASSWORD=&action=updateraww&realtime=1&rtfreq=5&dateutc=now&baromin=29.92&tempf=73.4&dewptf=62.9&humidity=70&windspeedmph=0.0&windgustmph=0.0&winddir=306&rainin=0.0&dailyrainin=0.0&solarradiation=0.31&UV=0.0&indoortempf=72.5&indoorhumidity=68weatherstation/updateweatherstation.php?"

// eslint-disable-next-line import/prefer-default-export
export class Garni1025ArcusSimulator extends CSimulator {
  correctTimestamp(decoded: IDomData | IStationData, sd: { timestamp: any }) {
    // eslint-disable-next-line no-param-reassign
    decoded.timestamp = sd.timestamp;
  }

  getPGData(decoded: any) {
    const n: null = null;
    return {
      dailyrain: decoded.dailyrain.toFixed(1),
      humidity: decoded.humidity.toFixed(0),
      humidityin: decoded.humidityin.toFixed(0),
      pressureabs: decoded.pressureabs.toFixed(1),
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
      pressurerel: n,
      eventrain: n,
      hourlyrain: n,
      weeklyrain: n,
      monthlyrain: n,
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
    const data = {} as IStationGarni1025ArcusDataRaw;
    data.ID = cdata.ID;
    data.PASSWORD = cdata.PASSWORD;
    data.action = cdata.action;
    data.realtime = cdata.realtime;
    data.rtfreq = cdata.rtfreq;
    data.dateutc = cdata.dateutc;
    data.baromin = round(cdata.baromin + offset, 3);
    data.tempf = round(cdata.tempf + offset, 1);
    data.dewptf = round(cdata.tempf + offset, 1);
    data.humidity = round(cdata.humidity + offset, 0);
    data.windspeedmph = round(cdata.windspeedmph + offset, 1);
    data.windgustmph = round(cdata.windgustmph + offset, 1);
    data.winddir = round((cdata.winddir + offset) % 360, 0);
    data.rainin = cdata.rainin;
    data.dailyrainin = cdata.dailyrainin;
    data.solarradiation = round(cdata.solarradiation + offset, 2);
    data.UV = round(cdata.solarradiation / 100, 0);
    data.indoortempf = round(cdata.indoortempf + offset, 1);
    data.indoorhumidity = round(cdata.indoorhumidity + offset, 0);
    return data;
  }

  generateData(d: Date, PASSKEY: string) {
    d.setUTCMilliseconds(0);
    const data = {} as IStationGarni1025ArcusDataRaw;
    data.ID = PASSKEY;
    data.PASSWORD = "";
    data.action = "updateraww";
    data.realtime = "1";
    data.rtfreq = 5;
    data.dateutc = "now";
    data.baromin = round(random(25, 35), 3);
    data.tempf = round(random(60, 80), 1);
    data.dewptf = round(random(60, 80), 1);
    data.humidity = round(random(40, 60), 0);
    data.windspeedmph = round(random(0, 50), 1);
    data.windgustmph = round(random(data.windspeedmph, 60), 1);
    data.winddir = round(random(0, 359), 0);
    data.rainin = round(random(0, 1), 3);
    data.dailyrainin = round(random(0, 1), 3);
    data.solarradiation = round(random(0, 1000), 2);
    data.UV = round(data.solarradiation / 100, 0);
    data.indoortempf = round(random(60, 80), 1);
    data.indoorhumidity = round(random(40, 60), 0);
    return data;
  }

  async postData(data: any) {
    try {
      await fetch(
        `http://localhost:18080/weatherstation/updateweatherstation.php?ID=${data.ID}&PASSWORD=${data.PASSWORD}&action=${data.action}&realtime=${data.realtime}&rtfreq=${data.rtfreq}&dateutc=${data.dateutc}&baromin=${data.baromin}&tempf=${data.tempf}&dewptf=${data.dewptf}&humidity=${data.humidity}&windspeedmph=${data.windspeedmph}&windgustmph=${data.windgustmph}&winddir=${data.winddir}&rainin=${data.rainin}&dailyrainin=${data.dailyrainin}&solarradiation=${data.solarradiation}&UV=${data.UV}&indoortempf=${data.indoortempf}&indoorhumidity=${data.indoorhumidity}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  }
}
