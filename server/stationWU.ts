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

function conv(raw: number | null, factor: number, precision: number): number | null {
  return raw != null ? round(raw * factor, precision) : null;
}

function fToC(raw: number | null, precision: number): number | null {
  return raw != null ? round((5 / 9) * (raw - 32), precision) : null;
}

export default class StationWU extends StationCommon {
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
    const TO_MM = 25.4;
    const TO_KM = 1.6;
    const TO_HPA = 33.8639;

    const timestamp = StationCommon.parseDate(data.dateutc);

    const tempfRaw = num(data, ["tempf"]);
    const temp = fToC(tempfRaw, 1);

    const humidityRaw = num(data, ["humidity"]);
    const humidity = conv(humidityRaw, 1.0, 0);

    const windspeedRaw = num(data, ["windspeedmph"]);
    const windspeed = conv(windspeedRaw, TO_KM, 1);

    const tempinRaw = num(data, ["tempinf", "indoortempf"]);
    const tempin = fToC(tempinRaw, 1);

    const pressurerelRaw = num(data, ["baromrelin"]);
    const pressurerel = conv(pressurerelRaw, TO_HPA, 1);

    const pressureabsRaw = num(data, ["baromabsin", "baromin"]);
    const pressureabs = conv(pressureabsRaw, TO_HPA, 1);

    const windgustRaw = num(data, ["windgustmph"]);
    const windgust = conv(windgustRaw, TO_KM, 1);

    const maxdailygustRaw = num(data, ["maxdailygust"]);
    const maxdailygust = conv(maxdailygustRaw, TO_KM, 1);

    const rainrateRaw = num(data, ["rainratein", "rainin"]);
    const rainrate = conv(rainrateRaw, TO_MM, 1);

    const eventrainRaw = num(data, ["eventrainin"]);
    const eventrain = conv(eventrainRaw, TO_MM, 1);

    const hourlyrainRaw = num(data, ["hourlyrainin"]);
    const hourlyrain = conv(hourlyrainRaw, TO_MM, 1);

    const dailyrainRaw = num(data, ["dailyrainin"]);
    const dailyrain = conv(dailyrainRaw, TO_MM, 1);

    const weeklyrainRaw = num(data, ["weeklyrainin"]);
    const weeklyrain = conv(weeklyrainRaw, TO_MM, 1);

    const monthlyrainRaw = num(data, ["monthlyrainin"]);
    const monthlyrain = conv(monthlyrainRaw, TO_MM, 1);

    const totalrainRaw = num(data, ["totalrainin"]);
    const totalrain = conv(totalrainRaw, TO_MM, 1);

    const solarradiationRaw = num(data, ["solarradiation"]);
    const solarradiation = conv(solarradiationRaw, 1.0, 0);

    const uvRaw = num(data, ["uv", "UV"]);
    const uv = conv(uvRaw, 1.0, 0);

    const humidityinRaw = num(data, ["humidityin", "indoorhumidity"]);
    const humidityin = conv(humidityinRaw, 1.0, 0);

    const winddirRaw = num(data, ["winddir"]);
    const winddir = conv(winddirRaw, 1.0, 0);

    const dewptfRaw = num(data, ["dewptf"]);
    const dewpt = dewptfRaw != null ? fToC(dewptfRaw, 1) : calculateDewPoint(temp, humidity);

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
