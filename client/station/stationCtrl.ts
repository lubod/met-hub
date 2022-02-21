import {
  IStationData,
  IStationTrendData,
  StationCfg,
} from "../../common/models/stationModel";
import StationData from "./stationData";

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
    const url = "/api/getLastData/station";
    // console.info(url);

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
    const url = "/api/getTrendData/station";
    // console.info(url);

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
