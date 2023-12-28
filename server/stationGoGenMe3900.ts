import {
  IStationData,
  IStationGoGenMe3900DataRaw,
} from "../common/stationModel";
import StationCommon from "./stationCommon";

class StationGoGenMe3900 extends StationCommon {
  initWithZeros(): IStationData {
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
      timestamp: new Date(0),
      place: "",
      maxdailygust: 0,
      eventrain: 0,
      hourlyrain: 0,
      dailyrain: 0,
      weeklyrain: 0,
      monthlyrain: 0,
      totalrain: 0,
      minuterain: null,
      dewpt: null,
    };
    return init;
  }

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
      timestamp: new Date(`${data.dateutc} UTC`),
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
      dewpt: null,
    };
    const date = new Date(decoded.timestamp);
    const toStore = decoded;
    return { date, decoded, toStore };
  }
}

export default StationGoGenMe3900;
