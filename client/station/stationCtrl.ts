import fetch from "node-fetch";
import {
  IStationData,
  IStationTrendData,
  StationCfg,
} from "../../common/stationModel";
import AuthData from "../auth/authData";
import ChartsCtrl from "../charts/chartsCtrl";
import StationData from "./stationData";

const ENV = process.env.ENV || "";

class StationCtrl {
  stationData: StationData;

  socket: any;

  timer: any;

  stationCfg: StationCfg;

  authData: AuthData;

  chartsCtrl: ChartsCtrl;

  constructor(
    socket: any,
    stationData: StationData,
    authData: AuthData,
    chartsCtrl: ChartsCtrl
  ) {
    this.stationData = stationData;
    this.stationCfg = new StationCfg();
    this.socket = socket;
    this.authData = authData;
    this.chartsCtrl = chartsCtrl;
  }

  start() {
    // console.log("start", new Date());
    this.fetchData();
    this.fetchTrendData();
    this.socket
      .getSocket()
      .on(this.stationCfg.SOCKET_CHANNEL, (data: IStationData) => {
        this.stationData.processData(data);
      });
    this.socket
      .getSocket()
      .on(this.stationCfg.SOCKET_TREND_CHANNEL, (data: IStationTrendData) => {
        this.stationData.processTrendData(data);
        this.chartsCtrl?.reload();
      });
    this.timer = setInterval(() => {
      this.stationData.setTime(new Date());
      if (this.stationData.oldData) {
        if (
          this.stationData.try === 0 ||
          this.stationData.try === 2 ||
          this.stationData.try === 5 ||
          this.stationData.try === 10 ||
          this.stationData.try === 30 ||
          this.stationData.try % 60 === 0
        ) {
          console.info("try", this.stationData.try, new Date());
          this.fetchData();
          this.fetchTrendData();
        }
        this.stationData.try += 1;
      }
    }, 1000);
  }

  async fetchData() {
    let url = "/api/getLastData/station";
    if (ENV === "dev") {
      url = "http://localhost:18080/api/getLastData/station";
      console.info(url);
    }

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

      const newData = await response.json();
      this.stationData.processData(newData);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchTrendData() {
    let url = "/api/getTrendData/station";
    if (ENV === "dev") {
      url = "http://localhost:18080/api/getTrendData/station";
      console.info(url);
    }

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

      const newData = await response.json();
      this.stationData.processTrendData(newData);
      // console.info(newData);
      this.chartsCtrl?.reload();
    } catch (e) {
      console.error(e);
    }
  }

  async fetchRainData() {
    const url = "/api/loadRainData";

    console.info(url);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.authData.access_token}`,
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
}

export default StationCtrl;
