import { DomCfg, IDomData, IDomTrendData } from "../../common/models/domModel";
import DomData from "./domData";

class DomCtrl {
  domData: DomData;

  domCfg: DomCfg;

  mySocket: any;

  constructor(mySocket: any, domData: DomData) {
    this.domData = domData;
    this.domCfg = new DomCfg();
    this.mySocket = mySocket;
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
      });
  }

  async fetchData() {
    const url = "/api/getLastData/dom";
    console.info(url);

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
    const url = "/api/getTrendData/dom";
    console.info(url);

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
    } catch (e) {
      console.error(e);
    }
  }
}

export default DomCtrl;
