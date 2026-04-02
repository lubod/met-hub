/* eslint-disable import/prefer-default-export */
import { IStation } from "./allStationsCfg";

export class AllStationsCfgClient {
  static map: Map<string, IStation> = new Map();

  static array: Array<IStation> = [];

  static async fetchAllStationsCfg(): Promise<IStation[] | null> {
    const url = `/api/getAllStationsCfg`;
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`An error has occured: ${response.status}`);
      }

      const cfg: IStation[] = await response.json();
      AllStationsCfgClient.map.clear();
      for (const station of cfg) {
        AllStationsCfgClient.map.set(station.id, station);
      }
      AllStationsCfgClient.array = cfg;
      return cfg;
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  static getStations() {
    return AllStationsCfgClient.map;
  }

  static getDefaultStationID(): string | undefined {
    return AllStationsCfgClient.array[0]?.id;
  }

  static getDefaultStation(): IStation | undefined {
    return AllStationsCfgClient.array[0];
  }

  static getStationByID(ID: string | null): IStation | undefined {
    if (ID == null) return undefined;
    return AllStationsCfgClient.map.get(ID);
  }
}
