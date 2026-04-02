import AuthData from "../client/auth/authData";
import DomData from "../client/dom/domData";
import StationData from "../client/station/stationData";
import { IStation } from "./allStationsCfg";
import { DomCfg, IDomTrendData } from "./domModel";
import { StationCfg } from "./stationCfg";

// eslint-disable-next-line import/prefer-default-export
export class CController {
  timer: ReturnType<typeof setInterval> | null = null;

  timerTrend: ReturnType<typeof setInterval> | null = null;

  authData: AuthData;

  test: boolean;

  domData: DomData;

  domCfg: DomCfg;

  stationID: string;

  stationData: StationData;

  stationCfg: StationCfg;

  constructor(authData: AuthData, test: boolean = false) {
    this.authData = authData;
    this.test = test;
    this.domData = new DomData();
    this.stationData = new StationData();
  }

  start() {
    this.stop();
    this.fetchData();
    this.fetchTrendData();
    this.timer = setInterval(() => {
      this.fetchData();
    }, 60000);
    this.timerTrend = setInterval(() => {
      this.fetchTrendData();
    }, 300000);
  }

  stop() {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.timerTrend != null) {
      clearInterval(this.timerTrend);
      this.timerTrend = null;
    }
  }

  getStationID(): string {
    return this.stationID;
  }

  setStation(station: IStation) {
    this.stationID = station.id;
    if (station.id === "dom") {
      this.domData.setStation(station);
    } else {
      this.stationCfg = station == null ? null : new StationCfg(station.id);
      this.stationData.setStation(station);
    }
  }

  private url(path: string): string {
    return this.test ? `http://localhost:8089${path}` : path;
  }

  private async privateFetch(url: string): Promise<any | null> {
    try {
      const response = await fetch(url, { headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error(`An error has occured: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private async fetchDomData() {
    this.domData.setLoading(true);
    const newData = await this.privateFetch(this.url("/api/getLastData/dom"));
    if (newData != null) this.domData.processData(newData);
  }

  private async fetchDomTrendData() {
    this.domData.trendData = {
      timestamp: [],
      temp: [],
      humidity: [],
      rain: [],
      living_room_air: [],
      living_room_floor: [],
      guest_room_air: [],
      guest_room_floor: [],
      bed_room_air: [],
      bed_room_floor: [],
      boys_room_air: [],
      boys_room_floor: [],
      petra_room_air: [],
      petra_room_floor: [],
    } as IDomTrendData;
    const newData = await this.privateFetch(this.url("/api/getTrendData/dom"));
    if (newData != null) this.domData.processTrendData(newData);
  }

  private async fetchSData() {
    if (this.stationData.station == null) {
      console.info("no station -> no data");
      return;
    }
    this.stationData.setLoading(true);
    const newData = await this.privateFetch(
      this.url(`/api/getLastData/station/${this.stationCfg.STATION_ID}`),
    );
    this.stationData.setData(newData);
    if (newData != null) this.stationData.setLoading(false);
  }

  private async fetchSTrendData() {
    if (this.stationData.station == null) {
      console.info("no station -> no trend data");
      return;
    }
    const newData = await this.privateFetch(
      this.url(`/api/getTrendData/station/${this.stationCfg.STATION_ID}`),
    );
    this.stationData.setTrendData(newData);
  }

  async fetchRainData() {
    if (this.stationCfg == null) {
      return;
    }
    const newData = await this.privateFetch(
      this.url(`/api/loadRainData/station/${this.stationCfg.STATION_ID}`),
    );
    if (newData != null) this.stationData.setRaindata(newData);
  }

  async fetchData() {
    if (this.stationID === "dom") {
      await this.fetchDomData();
    } else {
      await this.fetchSData();
    }
  }

  async fetchTrendData() {
    if (this.stationID === "dom") {
      await this.fetchDomTrendData();
    } else {
      await this.fetchSTrendData();
    }
  }
}
