import fetch from "node-fetch";
import { IStationData, IStationTrendData } from "../../common/stationModel";
import AuthData from "../auth/authData";
import StationData from "./stationData";
import { IController } from "../../common/controller";
import { StationCfg } from "../../common/stationCfg";
import { IStation } from "../../common/allStationsCfg";

class StationCtrl implements IController {
  stationData: StationData;

  socket: any;

  timer: any;

  authData: AuthData;

  stationCfg: StationCfg;

  test: boolean;

  listener = (data: IStationData) => {
    this.stationData.setData(data);
  };

  listenerTrend = (data: IStationTrendData) => {
    this.stationData.setTrendData(data);
  };

  constructor(socket: any, authData: AuthData, test: boolean = false) {
    this.socket = socket;
    this.authData = authData;
    this.test = test;
    this.stationData = new StationData();
  }

  setStation(station: IStation) {
    this.stop();
    this.stationCfg = station == null ? null : new StationCfg(station.id);
    this.stationData.setStation(station);
    this.start();
  }

  start() {
    // console.log("start", new Date());
    this.fetchData();
    this.fetchTrendData();
    this.socket.getSocket().on(this.stationCfg.SOCKET_CHANNEL, this.listener);
    this.socket
      .getSocket()
      .on(this.stationCfg.SOCKET_TREND_CHANNEL, this.listenerTrend);
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

  stop() {
    if (this.stationCfg != null) {
      this.socket
        .getSocket()
        .off(this.stationCfg.SOCKET_CHANNEL, this.listener);
      this.socket
        .getSocket()
        .off(this.stationCfg.SOCKET_TREND_CHANNEL, this.listenerTrend);
    }
    clearInterval(this.timer);
  }

  async fetchData() {
    let url = `/api/getLastData/station/${this.stationCfg.STATION_ID}`;

    if (this.test) {
      // test needs this
      url = `http://localhost:18080/api/getLastData/station/${this.stationCfg.STATION_ID}`;
      console.info(url);
    }

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

  async fetchTrendData() {
    let url = `/api/getTrendData/station/${this.stationCfg.STATION_ID}`;

    if (this.test) {
      // test needs this
      url = `http://localhost:18080/api/getTrendData/station/${this.stationCfg.STATION_ID}`;
      console.info(url);
    }

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
}

export default StationCtrl;
