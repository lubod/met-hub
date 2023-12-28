import fetch from "node-fetch";
import { DomCfg, IDomData, IDomTrendData } from "../../common/domModel";
import AuthData from "../auth/authData";
import DomData from "./domData";

class DomCtrl {
  domData: DomData;

  domCfg: DomCfg;

  timer: any;

  socket: any;

  authData: AuthData;

  test: boolean;

  listener = (data: IDomData) => {
    this.domData.processData(data);
  };

  listenerTrend = (data: IDomTrendData) => {
    this.domData.processTrendData(data);
  };

  constructor(mySocket: any, authData: AuthData, test: boolean = false) {
    this.domData = new DomData();
    this.domCfg = new DomCfg();
    this.socket = mySocket;
    this.authData = authData;
    this.test = test;
  }

  start() {
    this.fetchData();
    this.fetchTrendData();
    this.socket.getSocket().on(this.domCfg.SOCKET_CHANNEL, this.listener);
    this.socket
      .getSocket()
      .on(this.domCfg.SOCKET_TREND_CHANNEL, this.listenerTrend);
    this.timer = setInterval(() => {
      this.domData.setTime(new Date());
      if (this.domData.oldData) {
        if (
          this.domData.try === 0 ||
          this.domData.try === 2 ||
          this.domData.try === 5 ||
          this.domData.try === 10 ||
          this.domData.try === 30 ||
          this.domData.try % 60 === 0
        ) {
          console.info("try", this.domData.try, new Date());
          this.fetchData();
          this.fetchTrendData();
        }
        this.domData.try += 1;
      }
    }, 1000);
  }

  stop() {
    this.socket.getSocket().off(this.domCfg.SOCKET_CHANNEL, this.listener);
    this.socket
      .getSocket()
      .off(this.domCfg.SOCKET_TREND_CHANNEL, this.listenerTrend);
    clearInterval(this.timer);
  }

  async fetchData() {
    this.domData.data = { timestamp: null } as IDomData;
    let url = "/api/getLastData/dom";
    if (this.test) {
      url = "http://localhost:18080/api/getLastData/dom";
      console.info(url);
    }

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

  async fetchTrendData() {
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
      this.domData.processTrendData(newData);
    } catch (e) {
      console.error(e);
    }
  }
}

export default DomCtrl;
