import {
  IStationData,
  IStationGoGenMe3900DataRaw,
} from "../common/stationModel";
import StationCommon from "./stationCommon";

class StationGoGenMe3900 extends StationCommon {
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
    };
    const date = new Date(decoded.timestamp);
    const toStore = decoded;
    return { date, decoded, toStore };
  }
}

export default StationGoGenMe3900;
