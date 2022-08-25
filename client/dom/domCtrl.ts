import fetch from "node-fetch";
import { DomCfg, IDomData, IDomTrendData } from "../../common/domModel";
import ChartsCtrl from "../charts/chartsCtrl";
import DomData from "./domData";

const ENV = process.env.ENV || "";

class DomCtrl {
  domData: DomData;

  domCfg: DomCfg;

  timer: any;

  mySocket: any;

  chartsCtrl: ChartsCtrl;

  constructor(mySocket: any, domData: DomData, chartsCtrl: ChartsCtrl) {
    this.domData = domData;
    this.domCfg = new DomCfg();
    this.mySocket = mySocket;
    this.chartsCtrl = chartsCtrl;
    // props.socket.getSocket().emit('dom', 'getLastData');
  }

  start() {
    this.fetchData();
    this.fetchTrendData();
    this.mySocket
      .getSocket()
      .on(this.domCfg.SOCKET_CHANNEL, (data: IDomData) => {
        this.domData.processData(data);
      });
    this.mySocket
      .getSocket()
      .on(this.domCfg.SOCKET_TREND_CHANNEL, (data: IDomTrendData) => {
        this.domData.processTrendData(data);
        this.chartsCtrl?.reload();
      });
    this.timer = setInterval(() => {
      this.domData.setTime(new Date());
    }, 1000);
  }

  async fetchData() {
    let url = "/api/getLastData/dom";
    if (ENV === "dev") {
      url = "http://localhost:18080/api/getLastData/dom"; // todo
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
      this.domData.processData(newData);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchTrendData() {
    let url = "/api/getTrendData/dom";
    if (ENV === "dev") {
      url = "http://localhost:18080/api/getTrendData/dom";
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
      this.domData.processTrendData(newData);
      this.chartsCtrl?.reload();
    } catch (e) {
      console.error(e);
    }
  }
}

export default DomCtrl;
