import { IStationData } from "../common/stationModel";
import { calculateDewPoint, calculateFeelsLike, round } from "../common/units";
import StationCommon from "./stationCommon";

function num(data: any, key: keyof IStationData): number | null {
  if (data && data[key] !== undefined && data[key] !== null && data[key] !== "") {
    const v = Number(data[key]);
    if (Number.isFinite(v)) return v;
  }
  return null;
}

export default class StationJson extends StationCommon {
  initWithZeros(): IStationData {
    return {
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
      dewpt: 0,
      feelslike: 0,
    };
  }

  decodeData(data: any, place: string) {
    const timestamp = StationCommon.parseDate(data.dateutc || data.timestamp);

    const temp = num(data, "temp") != null ? round(num(data, "temp")!, 1) : null;
    const humidity = num(data, "humidity") != null ? round(num(data, "humidity")!, 0) : null;
    const windspeed = num(data, "windspeed") != null ? round(num(data, "windspeed")!, 1) : null;

    // Use raw dewpt or calculate it if missing but temp/humidity exist
    let dewpt = num(data, "dewpt") != null ? round(num(data, "dewpt")!, 1) : null;
    if (dewpt == null && temp != null && humidity != null) {
      dewpt = calculateDewPoint(temp, humidity);
    }

    // Use raw feelslike or calculate it if missing but temp/humidity/windspeed exist
    let feelslike = num(data, "feelslike") != null ? round(num(data, "feelslike")!, 1) : null;
    if (feelslike == null && temp != null && humidity != null && windspeed != null) {
      feelslike = calculateFeelsLike(temp, humidity, windspeed);
    }

    const decoded: IStationData = {
      timestamp,
      tempin: num(data, "tempin") != null ? round(num(data, "tempin")!, 1) : null,
      pressurerel: num(data, "pressurerel") != null ? round(num(data, "pressurerel")!, 1) : null,
      pressureabs: num(data, "pressureabs") != null ? round(num(data, "pressureabs")!, 1) : null,
      temp,
      windspeed,
      windgust: num(data, "windgust") != null ? round(num(data, "windgust")!, 1) : null,
      maxdailygust: num(data, "maxdailygust") != null ? round(num(data, "maxdailygust")!, 1) : null,
      rainrate: num(data, "rainrate") != null ? round(num(data, "rainrate")!, 1) : null,
      eventrain: num(data, "eventrain") != null ? round(num(data, "eventrain")!, 1) : null,
      hourlyrain: num(data, "hourlyrain") != null ? round(num(data, "hourlyrain")!, 1) : null,
      dailyrain: num(data, "dailyrain") != null ? round(num(data, "dailyrain")!, 1) : null,
      weeklyrain: num(data, "weeklyrain") != null ? round(num(data, "weeklyrain")!, 1) : null,
      monthlyrain: num(data, "monthlyrain") != null ? round(num(data, "monthlyrain")!, 1) : null,
      totalrain: num(data, "totalrain") != null ? round(num(data, "totalrain")!, 1) : null,
      solarradiation: num(data, "solarradiation") != null ? round(num(data, "solarradiation")!, 0) : null,
      uv: num(data, "uv") != null ? round(num(data, "uv")!, 0) : null,
      humidity,
      humidityin: num(data, "humidityin") != null ? round(num(data, "humidityin")!, 0) : null,
      winddir: num(data, "winddir") != null ? round(num(data, "winddir")!, 0) : null,
      place,
      minuterain: null,
      dewpt,
      feelslike,
    };

    return { date: timestamp, decoded, toStore: decoded };
  }
}
