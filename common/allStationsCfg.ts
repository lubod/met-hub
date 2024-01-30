/* eslint-disable guard-for-in */
/* eslint-disable import/prefer-default-export */
import { createClient } from "redis";
import { Dom } from "../server/dom";
import { IMeasurement } from "../server/measurement";
import StationGarni1025Arcus from "../server/stationGarni1025Arcus";
import StationGoGenMe3900 from "../server/stationGoGenMe3900";
import { StationCfg } from "./stationCfg";
import { create } from "../server/db";

export const ALL_STATIONS_CFG = "ALL_STATIONS_CFG";

export interface IStation {
  lat: number;
  lon: number;
  type: string;
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

  redisClient: any = null;

  constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  getMeas(station: IStation) {
    switch (station.type) {
      case "Dom":
        return new Dom();
      case "Garni 1025 Arcus":
        return new StationGarni1025Arcus(station.id);
      case "GoGen Me 3900":
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
    const reply = await this.redisClient.hGetAll(ALL_STATIONS_CFG);
    for (const item in reply) {
      console.info(reply[item]);
      const station: IStation = JSON.parse(reply[item]);
      station.measurement = this.getMeas(station);
      this.set(station);
    }
  }
  // AllStationsCfg.map.set();

  async writeCfg() {
    console.log("WRITE CFG");
    for (const [key, value] of this.map.entries()) {
      // eslint-disable-next-line no-await-in-loop
      await this.redisClient.hSet(ALL_STATIONS_CFG, key, JSON.stringify(value));
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
    await this.redisClient.hSet(
      ALL_STATIONS_CFG,
      station.id,
      JSON.stringify(station),
    ); // todo
    // eslint-disable-next-line no-param-reassign
    station.measurement = this.getMeas(station);
    this.set(station);
    create(station.id);
  }
}
