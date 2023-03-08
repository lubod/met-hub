/* eslint-disable guard-for-in */
/* eslint-disable import/prefer-default-export */
import { IStation } from "./allStationsCfg";

export class AllStationsCfgClient {
  static map: Map<string, IStation> = new Map();

  static array: Array<IStation> = [];

  static async fetchAllStationsCfg() {
    const url = `/api/getAllStationsCfg`;
    // if (ENV !== "dev") {
    // test needs this
    // url = `http://localhost:18080/api/getAllStationsCfg`;
    // console.info(url);
    // }

    try {
      const response = await fetch(url, {
        headers: {
          // Authorization: `Bearer ${props.auth.getToken()}`,
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const cfg = await response.json();
      console.info(cfg);

      for (const station of cfg) {
        AllStationsCfgClient.map.set(station.id, station);
      }
      AllStationsCfgClient.array = cfg;
    } catch (e) {
      console.error(e);
    }
  }

  static getStations() {
    return AllStationsCfgClient.map;
  }

  static getDefaultStationID() {
    return AllStationsCfgClient.array[0].id;
  }

  static getDefaultStation() {
    return AllStationsCfgClient.array[0];
  }

  static getStationByID(ID: string) {
    return AllStationsCfgClient.map.get(ID);
  }
}
