/* eslint-disable import/prefer-default-export */
import { Dom } from "../server/dom";
import redisClient from "../server/redisClient";
import { IMeasurement } from "../server/measurement";
import StationGarni1025Arcus from "../server/stationGarni1025Arcus";
import StationGoGenMe3900 from "../server/stationGoGenMe3900";
import { StationCfg } from "./stationCfg";
import { StationType } from "./stationType";
import { create } from "../server/db";

export const ALL_STATIONS_CFG = "ALL_STATIONS_CFG";

export interface IStation {
  lat: number;
  lon: number;
  type: StationType;
  place: string;
  passkey: string;
  id: string;
  measurement: IMeasurement;
  public: boolean;
  owner: string;
}

export class AllStationsCfg {
  map: Map<string, IStation> = new Map();

  userStations: Map<string, Set<string>> = new Map();

  publicStations: Set<string> = new Set();

  passkey2IDMap: Map<string, string> = new Map();

  measurements: Array<IMeasurement> = [];

  getMeas(station: IStation): IMeasurement {
    switch (station.type) {
      case StationType.Dom:
        return new Dom();
      case StationType.Garni1025Arcus:
        return new StationGarni1025Arcus(station.id);
      case StationType.GoGenMe3900:
        return new StationGoGenMe3900(station.id);
      default:
        throw new Error(`Unknown station type ${station.type}`);
    }
  }

  set(station: IStation) {
    this.map.set(station.id, station);
    if (station.passkey != null) {
      this.passkey2IDMap.set(station.passkey, station.id);
    }
    let mys = this.userStations.get(station.owner);
    if (mys == null) {
      mys = new Set();
    }
    mys.add(station.id);
    this.userStations.set(station.owner, mys);
    this.measurements.push(station.measurement);
    if (station.public) {
      this.publicStations.add(station.id);
    }
  }

  async readCfg() {
    console.log("READ CFG");
    const reply = await redisClient.hGetAll(ALL_STATIONS_CFG);
    for (const [, raw] of Object.entries(reply)) {
      let station: IStation;
      try {
        station = JSON.parse(raw);
      } catch (e) {
        console.error("readCfg: failed to parse station entry, skipping:", raw, e);
        continue;
      }
      try {
        station.measurement = this.getMeas(station);
      } catch (e) {
        console.error("readCfg: unknown station type, skipping:", station.id, station.type);
        continue;
      }
      console.info(JSON.stringify(station));
      this.set(station);
    }
  }

  async writeCfg() {
    console.log("WRITE CFG");
    for (const [key, value] of this.map.entries()) {
      // eslint-disable-next-line no-await-in-loop
      await redisClient.hSet(ALL_STATIONS_CFG, key, JSON.stringify(value));
    }
  }

  getStations() {
    return this.map;
  }

  getMeasurements() {
    return this.measurements;
  }

  getDefaultStationID(): string | undefined {
    return [...this.map.keys()][0];
  }

  getSecondDefaultStationID(): string | undefined {
    return [...this.map.keys()][1];
  }

  getDefaultStation(): IStation | undefined {
    const id = this.getDefaultStationID();
    return id != null ? this.map.get(id) : undefined;
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

  getStationsByUser(userID: string) {
    return this.userStations.get(userID);
  }

  getStationCfg(stationID: string) {
    return new StationCfg(stationID);
  }

  getPublicStations() {
    return this.publicStations;
  }

  async addStation(station: IStation) {
    await redisClient.hSet(
      ALL_STATIONS_CFG,
      station.id,
      JSON.stringify(station),
    );
    // eslint-disable-next-line no-param-reassign
    station.measurement = this.getMeas(station);
    this.set(station);
    create(station.id);
  }
}
