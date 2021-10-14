export class StationCfg {
    TABLE = 'stanica';
    SOCKET_CHANNEL = 'station';
    SOCKET_TREND_CHANNEL = 'station-trend';
    REDIS_LAST_DATA_KEY = 'station-last';
    REDIS_MINUTE_DATA_KEY = 'station-minute-data';
    REDIS_STORE_CHANNEL = 'station-store-pubsub';
    REDIS_TREND_KEY = 'station-trend';
}

export interface IStationData {
    timestamp: string;
    time: string;
    date: string;
    place: string;
    tempin: number;
    humidityin: number;
    temp: number;
    humidity: number;
    pressurerel: number;
    pressureabs: number;
    windgust: number;
    windspeed: number;
    winddir: number;
    maxdailygust: number;
    solarradiation: number;
    uv: number;
    rainrate: number;
    eventrain: number;
    hourlyrain: number;
    dailyrain: number;
    weeklyrain: number;
    monthlyrain: number;
    totalrain: number;
}

/*
curl --header "Content-Type: application/json" --request POST --data \
'{ "PASSKEY": "33564A0851CC0C0D15FE3353FB8D8B47", 
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
export interface IStationDataRaw {
    PASSKEY: string;
    stationtype: string;
    dateutc: string;
    tempinf: number;
    humidityin: number;
    baromrelin: number;
    baromabsin: number;
    tempf: number;
    humidity: number;
    winddir: number;
    windspeedmph: number;
    windgustmph: number;
    maxdailygust: number;
    rainratein: number;
    eventrainin: number;
    hourlyrainin: number;
    dailyrainin: number;
    weeklyrainin: number;
    monthlyrainin: number;
    totalrainin: number;
    solarradiation: number;
    uv: number;
    wh65batt: number;
    freq: string;
    model: string;
}

export interface IStationTrendData {
    timestamp: Array<string>;
    tempin: Array<number>;
    humidityin: Array<number>;
    temp: Array<number>;
    humidity: Array<number>;
    pressurerel: Array<number>;
    windgust: Array<number>;
    windspeed: Array<number>;
    winddir: Array<number>;
    solarradiation: Array<number>;
    uv: Array<number>;
    rainrate: Array<number>;
}


