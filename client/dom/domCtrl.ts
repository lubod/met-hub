import fetch from "node-fetch";
import { DomCfg, IDomData, IDomTrendData } from "../../common/domModel";
import AuthData from "../auth/authData";
import ChartsCtrl from "../charts/chartsCtrl";
import DomData from "./domData";

const ENV = process.env.ENV || "";

class DomCtrl {
  domData: DomData;

  domCfg: DomCfg;

  timer: any;

  socket: any;

  authData: AuthData;

  listener = (data: IDomData) => {
    this.domData.processData(data);
  };

  listenerTrend = (data: IDomTrendData) => {
    this.domData.processTrendData(data);
  };

  constructor(
    mySocket: any,
    domData: DomData,
    chartsCtrl: ChartsCtrl,
    authData: AuthData
  ) {
    this.domData = domData;
    this.domCfg = new DomCfg();
    this.socket = mySocket;
    this.authData = authData;
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
    if (ENV === "dev") {
      url = "http://localhost:18080/api/getLastData/dom";
      console.info(url);
    }

    try {
      this.domData.setLoading(true);
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
      obyvacka_vzduch: [],
      obyvacka_podlaha: [],
      pracovna_vzduch: [],
      pracovna_podlaha: [],
      spalna_vzduch: [],
      spalna_podlaha: [],
      chalani_vzduch: [],
      chalani_podlaha: [],
      petra_vzduch: [],
      petra_podlaha: [],
    } as IDomTrendData;
    let url = "/api/getTrendData/dom";
    if (ENV === "dev") {
      url = "http://localhost:18080/api/getTrendData/dom";
      console.info(url);
    }

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
      this.domData.processTrendData(newData);
    } catch (e) {
      console.error(e);
    }
  }
}

export default DomCtrl;
