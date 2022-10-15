/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */

import { IStationCfg } from "./stationCfg";
import { STATION_MEASUREMENTS_DESC } from "./stationModel";

export class StationGoGenMe3900Cfg implements IStationCfg {
  STATION_ID = "1";

  TABLE = "stanica";

  COLUMNS = [
    STATION_MEASUREMENTS_DESC.TEMPERATUREIN.col,
    STATION_MEASUREMENTS_DESC.HUMIDITYIN.col,
    STATION_MEASUREMENTS_DESC.PRESSURE.col,
    "pressureabs", // todo
    STATION_MEASUREMENTS_DESC.TEMPERATURE.col,
    STATION_MEASUREMENTS_DESC.HUMIDITY.col,
    STATION_MEASUREMENTS_DESC.WINDDIR.col,
    STATION_MEASUREMENTS_DESC.WINDSPEED.col,
    STATION_MEASUREMENTS_DESC.WINDGUST.col,
    STATION_MEASUREMENTS_DESC.RAINRATE.col,
    STATION_MEASUREMENTS_DESC.SOLAR.col,
    STATION_MEASUREMENTS_DESC.UV.col,
    STATION_MEASUREMENTS_DESC.EVENTRAIN.col,
    STATION_MEASUREMENTS_DESC.HOURLYRAIN.col,
    STATION_MEASUREMENTS_DESC.DAILYRAIN.col,
    STATION_MEASUREMENTS_DESC.WEEKLYRAIN.col,
    STATION_MEASUREMENTS_DESC.MONTHLYRAIN.col,
  ];

  SOCKET_CHANNEL = "station";

  SOCKET_TREND_CHANNEL = "station-trend";

  REDIS_LAST_DATA_KEY = "station-last";

  REDIS_MINUTE_DATA_KEY = "station-minute-data";

  REDIS_STORE_CHANNEL = "station-store-pubsub";

  REDIS_TREND_KEY = "station-trend";
}
