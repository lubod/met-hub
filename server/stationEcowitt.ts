import { IStationData } from "../common/stationModel";
import { calculateDewPoint, calculateFeelsLike, round } from "../common/units";
import StationCommon from "./stationCommon";

function num(data: any, aliases: string[]): number | null {
  for (const key of aliases) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      const v = Number(data[key]);
      if (Number.isFinite(v)) return v;
    }
  }
  return null;
}

export default class StationEcowitt extends StationCommon {
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
    const timestamp = StationCommon.parseDate(data.dateutc);

    // Temp outdoor: tempc (metric), or convert tempf (imperial)
    let temp = num(data, ["tempc"]);
    if (temp == null) {
      const tempf = num(data, ["tempf"]);
      if (tempf != null) temp = round((5 / 9) * (tempf - 32), 1);
    } else {
      temp = round(temp, 1);
    }

    // Temp indoor: tempinc (metric), or convert tempinf (imperial)
    let tempin = num(data, ["tempinc"]);
    if (tempin == null) {
      const tempinf = num(data, ["tempinf"]);
      if (tempinf != null) tempin = round((5 / 9) * (tempinf - 32), 1);
    } else {
      tempin = round(tempin, 1);
    }

    const humidity = num(data, ["humidity"]) != null ? round(num(data, ["humidity"])!, 0) : null;
    const humidityin = num(data, ["humidityin"]) != null ? round(num(data, ["humidityin"])!, 0) : null;

    // Pressure rel: baromrelhpa (metric) or convert baromrelin (imperial)
    let pressurerel = num(data, ["baromrelhpa"]);
    if (pressurerel == null) {
      const baromrelin = num(data, ["baromrelin"]);
      if (baromrelin != null) pressurerel = round(baromrelin * 33.8639, 1);
    } else {
      pressurerel = round(pressurerel, 1);
    }

    // Pressure abs: baromabshpa (metric) or convert baromabsin (imperial)
    let pressureabs = num(data, ["baromabshpa"]);
    if (pressureabs == null) {
      const baromabsin = num(data, ["baromabsin"]);
      if (baromabsin != null) pressureabs = round(baromabsin * 33.8639, 1);
    } else {
      pressureabs = round(pressureabs, 1);
    }

    // Wind speed: windspeedkmh (metric) or convert windspeedmph (imperial)
    let windspeed = num(data, ["windspeedkmh"]);
    if (windspeed == null) {
      const windspeedmph = num(data, ["windspeedmph"]);
      if (windspeedmph != null) windspeed = round(windspeedmph * 1.6, 1);
    } else {
      windspeed = round(windspeed, 1);
    }

    // Wind gust: windgustkmh (metric) or convert windgustmph (imperial)
    let windgust = num(data, ["windgustkmh"]);
    if (windgust == null) {
      const windgustmph = num(data, ["windgustmph"]);
      if (windgustmph != null) windgust = round(windgustmph * 1.6, 1);
    } else {
      windgust = round(windgust, 1);
    }

    // Max daily gust: maxdailygustkmh (metric) or convert maxdailygust (imperial)
    let maxdailygust = num(data, ["maxdailygustkmh"]);
    if (maxdailygust == null) {
      const maxdailygustmph = num(data, ["maxdailygust"]);
      if (maxdailygustmph != null) maxdailygust = round(maxdailygustmph * 1.6, 1);
    } else {
      maxdailygust = round(maxdailygust, 1);
    }

    // Rainrate: rainratemm (metric) or convert rainratein (imperial)
    let rainrate = num(data, ["rainratemm", "rainrate"]);
    if (rainrate == null) {
      const rainratein = num(data, ["rainratein"]);
      if (rainratein != null) rainrate = round(rainratein * 25.4, 1);
    } else {
      rainrate = round(rainrate, 1);
    }

    // Eventrain: eventrainmm (metric) or convert eventrainin (imperial)
    let eventrain = num(data, ["eventrainmm", "eventrain"]);
    if (eventrain == null) {
      const eventrainin = num(data, ["eventrainin"]);
      if (eventrainin != null) eventrain = round(eventrainin * 25.4, 1);
    } else {
      eventrain = round(eventrain, 1);
    }

    // Hourlyrain: hourlyrainmm (metric) or convert hourlyrainin (imperial)
    let hourlyrain = num(data, ["hourlyrainmm", "hourlyrain"]);
    if (hourlyrain == null) {
      const hourlyrainin = num(data, ["hourlyrainin"]);
      if (hourlyrainin != null) hourlyrain = round(hourlyrainin * 25.4, 1);
    } else {
      hourlyrain = round(hourlyrain, 1);
    }

    // Dailyrain: dailyrainmm (metric) or convert dailyrainin (imperial)
    let dailyrain = num(data, ["dailyrainmm", "dailyrain"]);
    if (dailyrain == null) {
      const dailyrainin = num(data, ["dailyrainin"]);
      if (dailyrainin != null) dailyrain = round(dailyrainin * 25.4, 1);
    } else {
      dailyrain = round(dailyrain, 1);
    }

    // Weeklyrain: weeklyrainmm (metric) or convert weeklyrainin (imperial)
    let weeklyrain = num(data, ["weeklyrainmm", "weeklyrain"]);
    if (weeklyrain == null) {
      const weeklyrainin = num(data, ["weeklyrainin"]);
      if (weeklyrainin != null) weeklyrain = round(weeklyrainin * 25.4, 1);
    } else {
      weeklyrain = round(weeklyrain, 1);
    }

    // Monthlyrain: monthlyrainmm (metric) or convert monthlyrainin (imperial)
    let monthlyrain = num(data, ["monthlyrainmm", "monthlyrain"]);
    if (monthlyrain == null) {
      const monthlyrainin = num(data, ["monthlyrainin"]);
      if (monthlyrainin != null) monthlyrain = round(monthlyrainin * 25.4, 1);
    } else {
      monthlyrain = round(monthlyrain, 1);
    }

    // Totalrain: totalrainmm (metric) or convert totalrainin (imperial)
    let totalrain = num(data, ["totalrainmm", "totalrain"]);
    if (totalrain == null) {
      const totalrainin = num(data, ["totalrainin"]);
      if (totalrainin != null) totalrain = round(totalrainin * 25.4, 1);
    } else {
      totalrain = round(totalrain, 1);
    }

    const solarradiation = num(data, ["solarradiation"]) != null ? round(num(data, ["solarradiation"])!, 0) : null;
    const uv = num(data, ["uv", "UV"]) != null ? round(num(data, ["uv", "UV"])!, 0) : null;
    const winddir = num(data, ["winddir"]) != null ? round(num(data, ["winddir"])!, 0) : null;

    let dewpt = null;
    if (temp != null && humidity != null) {
      dewpt = calculateDewPoint(temp, humidity);
    }

    const feelslike = calculateFeelsLike(temp, humidity, windspeed);

    const decoded: IStationData = {
      timestamp,
      tempin,
      pressurerel,
      pressureabs,
      temp,
      windspeed,
      windgust,
      maxdailygust,
      rainrate,
      eventrain,
      hourlyrain,
      dailyrain,
      weeklyrain,
      monthlyrain,
      totalrain,
      solarradiation,
      uv,
      humidity,
      humidityin,
      winddir,
      place,
      minuterain: null,
      dewpt,
      feelslike,
    };

    return { date: timestamp, decoded, toStore: decoded };
  }
}
