import fetch from "node-fetch";
import { IMeasurementDesc } from "../../common/measurementDesc";
import AuthData from "../auth/authData";
import ChartsData, { CData } from "./chartsData";

// const ENV = process.env.ENV || "";

class ChartsCtrl {
  chartsData: ChartsData;

  authData: AuthData;

  timer: any;

  constructor(chartsData: ChartsData, authData: AuthData) {
    this.chartsData = chartsData;
    this.authData = authData;
  }

  start() {
    this.timer = setInterval(() => {
      this.reload();
    }, 60000);
  }

  async reload() {
    this.load(
      this.chartsData.range,
      this.chartsData.page,
      this.chartsData.measurement,
      this.chartsData.stationID
    );
  }

  async load(of: string, p: number, m: IMeasurementDesc, stationID: string) {
    if (!this.authData.isAuth) {
      console.info("no auth -> no load");
      return;
    }
    try {
      this.chartsData.setNewData(true, [], new CData());
      const o = parseInt(of.split("|")[0], 10) * 1000;
      // eslint-disable-next-line no-promise-executor-return
      // return new Promise((resolve) => setTimeout(resolve, 2000));
      const start = new Date(Date.now() - o + p * o);
      const end = new Date(Date.now() + p * o);
      let url = `/api/loadData?start=${start.toISOString()}&end=${end.toISOString()}&measurement=${
        m.table
      }`;
      if (stationID !== "dom") {
        url += `_${stationID}`;
      }
      url += `:${m.col}`;
      if (m.col2 !== "") {
        url += `:${m.col2}`;
      }
      console.info(url);

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
      let max: number = null;
      let min: number = null;
      let avg: string = null;
      let total: number = null;

      const range = this.chartsData.range.split("|")[1];

      const y = m.col;
      const y2 = m.col2;
      for (let i = 0; i < newData.length; i += 1) {
        if (i === 0) {
          // console.info(newData[i]);
          const val = parseFloat(newData[i][y]);
          // eslint-disable-next-line no-multi-assign
          max = min = total = val;
        } else {
          const val = parseFloat(newData[i][y]);
          if (val > max) {
            max = val;
          }
          if (val < min) {
            min = val;
          }
          total += val;
        }
      }
      avg = total != null ? (total / newData.length).toFixed(1) : "";
      const sum = total != null ? total.toFixed(1) : "";
      let domainMin = Math.floor(min - (max / 100) * 5);
      const domainMax = Math.ceil(max + (max / 100) * 5);
      const last = newData.length > 0 ? newData[newData.length - 1][y] : null;

      if (y2 !== "") {
        domainMin = 0;
      }

      this.chartsData.setNewData(false, newData, {
        min,
        max,
        avg,
        sum,
        domainMin,
        domainMax,
        label: m.label,
        unit: m.unit,
        range,
        couldBeNegative: m.couldBeNegative,
        last,
      });
      // console.info(min, max, avg, sum);
      // this.chartsData.setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }
}

export default ChartsCtrl;
