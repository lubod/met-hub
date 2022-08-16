import fetch from "node-fetch";
import {
  IStationData,
  IStationTrendData,
  StationCfg,
} from "../../common/stationModel";
import StationData from "./stationData";

const ENV = process.env.ENV || "";

class StationCtrl {
  stationData: StationData;

  socket: any;

  timer: any;

  stationCfg: StationCfg;

  constructor(socket: any, stationData: StationData) {
    this.stationData = stationData;
    this.stationCfg = new StationCfg();
    this.socket = socket;
  }

  start() {
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
      });
    this.timer = setInterval(() => {
      this.stationData.setTime(new Date());
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
    } catch (e) {
      console.error(e);
    }
  }
}

export default StationCtrl;
