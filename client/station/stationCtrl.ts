import fetch from "node-fetch";
import { IStationData, IStationTrendData } from "../../common/stationModel";
import AuthData from "../auth/authData";
import ChartsCtrl from "../charts/chartsCtrl";
import StationData from "./stationData";
import { IController } from "../../common/controller";
import { StationCfg } from "../../common/stationCfg";

const ENV = process.env.ENV || "";

class StationCtrl implements IController {
  stationData: StationData;

  socket: any;

  timer: any;

  authData: AuthData;

  chartsCtrl: ChartsCtrl;

  stationCfg: StationCfg;

  constructor(
    socket: any,
    stationData: StationData,
    authData: AuthData,
    chartsCtrl: ChartsCtrl
  ) {
    this.stationData = stationData;
    this.socket = socket;
    this.authData = authData;
    this.chartsCtrl = chartsCtrl;
    this.stationCfg = new StationCfg(stationData.stationID);
  }

  setStation(stationID: string) {
    this.stop();
    this.stationCfg = new StationCfg(stationID);
    this.stationData.ctime = new Date();
    this.stationData.oldData = true;
    this.stationData.floatingRainData = false;
    this.stationData.raindata = null;
    this.stationData.try = 0;
    this.stationData.loading = true;
    this.stationData.stationID = stationID;
    this.start();
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

  stop() {
    this.socket
      .getSocket()
      .off(this.stationCfg.SOCKET_CHANNEL, (data: IStationData) => {
        this.stationData.processData(data);
      });
    this.socket
      .getSocket()
      .off(this.stationCfg.SOCKET_TREND_CHANNEL, (data: IStationTrendData) => {
        this.stationData.processTrendData(data);
        this.chartsCtrl?.reload();
      });
    clearInterval(this.timer);
  }

  async fetchData() {
    this.stationData.data = { timestamp: null } as IStationData;

    let url = `/api/getLastData/station/${this.stationCfg.STATION_ID}`;

    if (ENV === "dev") {
      // test needs this
      url = `http://localhost:18080/api/getLastData/station/${this.stationCfg.STATION_ID}`;
      console.info(url);
    }

    try {
      this.stationData.setLoading(true);
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
      this.stationData.setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchTrendData() {
    this.stationData.trendData = {
      timestamp: [],
      tempin: [],
      humidityin: [],
      temp: [],
      humidity: [],
      pressurerel: [],
      windgust: [],
      windspeed: [],
      winddir: [],
      solarradiation: [],
      uv: [],
      rainrate: [],
    } as IStationTrendData;
    let url = `/api/getTrendData/station/${this.stationCfg.STATION_ID}`;

    if (ENV === "dev") {
      // test needs this
      url = `http://localhost:18080/api/getTrendData/station/${this.stationCfg.STATION_ID}`;
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
