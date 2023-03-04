import {
  IStationData,
  IStationGarni1025ArcusDataRaw,
} from "../common/stationModel";
import StationCommon from "./stationCommon";

export default class StationGarni1025Arcus extends StationCommon {
  initWithZeros(): IStationData {
    const init: IStationData = {
      tempin: 0,
      temp: 0,
      pressurerel: null,
      pressureabs: 0,
      windgust: 0,
      windspeed: 0,
      rainrate: 0,
      solarradiation: 0,
      uv: 0,
      humidityin: 0,
      humidity: 0,
      winddir: 0,
      timestamp: new Date(0),
      place: "",
      maxdailygust: null,
      eventrain: null,
      hourlyrain: null,
      dailyrain: 0,
      weeklyrain: null,
      monthlyrain: null,
      totalrain: null,
      minuterain: null,
      dewpt: 0,
    };
    return init;
  }

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

  decodeData(data: IStationGarni1025ArcusDataRaw) {
    const TO_MM = 25.4;
    const TO_KM = 1.6;
    const TO_HPA = 33.8639;

    function round(value: number, precision: number) {
      const multiplier = 10 ** (precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    //    console.log(data)
    const decoded: IStationData = {
      timestamp: new Date(),
      tempin: round((5 / 9) * (data.indoortempf - 32), 1),
      pressureabs: round(data.baromin * TO_HPA, 1),
      pressurerel: null,
      temp: round((5 / 9) * (data.tempf - 32), 1),
      windspeed: round(data.windspeedmph * TO_KM, 1),
      windgust: round(data.windgustmph * TO_KM, 1),
      maxdailygust: null,
      rainrate: round(data.rainin * TO_MM, 1),
      eventrain: null,
      hourlyrain: null,
      dailyrain: round(data.dailyrainin * TO_MM, 1),
      weeklyrain: null,
      monthlyrain: null,
      totalrain: null,
      solarradiation: round(data.solarradiation * 1.0, 0),
      uv: round(data.UV * 1.0, 0),
      humidity: round(data.humidity * 1.0, 0),
      humidityin: round(data.indoorhumidity * 1.0, 0),
      winddir: round(data.winddir * 1.0, 0),
      place: "Demanovska Dolina",
      minuterain: null,
      dewpt: round((5 / 9) * (data.dewptf - 32), 1),
    };
    const date = new Date(decoded.timestamp);
    const toStore = decoded;
    // console.info(data, date, decoded);
    return { date, decoded, toStore };
  }
}
