/* eslint-disable guard-for-in */
/* eslint-disable import/prefer-default-export */
import { createClient } from "redis";
import { Dom } from "../server/dom";
import { IMeasurement } from "../server/measurement";
import StationGarni1025Arcus from "../server/stationGarni1025Arcus";
import StationGoGenMe3900 from "../server/stationGoGenMe3900";
import { StationCfg } from "./stationCfg";

export interface IStation {
  lat: number;
  lon: number;
  type: string;
  place: string;
  passkey: string;
  id: string;
  measurement: IMeasurement;
}

export class AllStationsCfg {
  map: Map<string, IStation> = new Map();

  array: Array<IStation> = [];

  passkey2IDMap: Map<string, string> = new Map();

  measurements: Array<IMeasurement> = [];

  async readCfg() {
    console.log("READ CFG");
    const redisClient = createClient();
    redisClient.connect();
    const reply = await redisClient.hGetAll("ALL_STATIONS_CFG");
    for (const item in reply) {
      console.info(reply[item]);
      const station: IStation = JSON.parse(reply[item]);
      switch (station.type) {
        case "Dom":
          station.measurement = new Dom();
          break;
        case "Garni 1025 Arcus":
          station.measurement = new StationGarni1025Arcus(station.id);
          break;
        case "GoGen Me 3900":
          station.measurement = new StationGoGenMe3900(station.id);
          break;
        default:
          console.error("Unknown station type", station.type);
      }
      this.map.set(station.id, station);
      const cStation = {} as IStation;
      cStation.id = station.id;
      cStation.lat = station.lat;
      cStation.lon = station.lon;
      cStation.place = station.place;
      cStation.type = station.type;
      this.array.push(cStation); // json to client
      this.passkey2IDMap.set(station.passkey, station.id);
      this.measurements.push(station.measurement);
    }
    // AllStationsCfg.map.set();
  }

  async writeCfg() {
    const redisClient = createClient();
    redisClient.connect();
    console.log("WRITE CFG");
    for (const [key, value] of this.map.entries()) {
      // eslint-disable-next-line no-await-in-loop
      await redisClient.hSet("ALL_STATIONS_CFG", key, JSON.stringify(value));
    }
  }

  getStations() {
    return this.map;
  }

  getMeasurements() {
    return this.measurements;
  }

  getDefaultStationID() {
    return [...this.map.keys()][0];
  }

  getSecondDefaultStationID() {
    return [...this.map.keys()][1];
  }

  getDefaultStation() {
    return this.map.get(this.getDefaultStationID());
  }

  passkey2ID(passkey: string) {
    return this.passkey2IDMap.get(passkey);
  }

  getStationByPasskey(passkey: string) {
    return this.map.get(this.passkey2ID(passkey));
  }

  getStationByID(ID: string) {
    return this.map.get(ID);
  }

  getStationCfg(stationID: string) {
    return new StationCfg(stationID);
  }
}
