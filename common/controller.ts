import fetch from "node-fetch";
import AuthData from "../client/auth/authData";
import DomData from "../client/dom/domData";
import StationData from "../client/station/stationData";
import { IStation } from "./allStationsCfg";
import { DomCfg, IDomData, IDomTrendData } from "./domModel";
import { StationCfg } from "./stationCfg";

// eslint-disable-next-line import/prefer-default-export
export class CController {
  timer: any;

  timerTrend: any;

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
    // console.log("start", new Date());
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
    clearInterval(this.timer);
    clearInterval(this.timerTrend);
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

  private async fetchDomData() {
    this.domData.data = { timestamp: null } as IDomData; // todo
    let url = "/api/getLastData/dom";
    if (this.test) {
      url = "http://localhost:18080/api/getLastData/dom";
    }
    console.info(url);

    try {
      this.domData.setLoading(true);
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const newData = await response.json();
      this.domData.processData(newData);
    } catch (e) {
      console.error(e);
    }
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
    let url = "/api/getTrendData/dom";
    if (this.test) {
      url = "http://localhost:18080/api/getTrendData/dom";
    }
    console.info(url);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const newData = await response.json();
      this.domData.processTrendData(newData);
    } catch (e) {
      console.error(e);
    }
  }

  private async fetchSData() {
    if (this.stationData.station == null) {
      console.info("no station -> no data");
      return;
    }

    let url = `/api/getLastData/station/${this.stationCfg.STATION_ID}`;

    if (this.test) {
      // test needs this
      url = `http://localhost:18080/api/getLastData/station/${this.stationCfg.STATION_ID}`;
    }
    console.info(url);

    try {
      this.stationData.setLoading(true);
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const newData = await response.json();
      this.stationData.setData(newData);
      this.stationData.setLoading(false);
    } catch (e) {
      this.stationData.setData(null);
      console.error(e);
    }
  }

  private async fetchSTrendData() {
    if (this.stationData.station == null) {
      console.info("no station -> no trend data");
      return;
    }

    let url = `/api/getTrendData/station/${this.stationCfg.STATION_ID}`;

    if (this.test) {
      // test needs this
      url = `http://localhost:18080/api/getTrendData/station/${this.stationCfg.STATION_ID}`;
    }
    console.info(url);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const newData = await response.json();
      this.stationData.setTrendData(newData);
      // console.info(newData);
    } catch (e) {
      this.stationData.setTrendData(null);
      console.error(e);
    }
  }

  async fetchRainData() {
    const url = `/api/loadRainData/station/${this.stationCfg.STATION_ID}`;

    console.info(url);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const newData = await response.json();
      // console.info(newData);
      this.stationData.setRaindata(newData);
    } catch (e) {
      console.error(e);
    }
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
