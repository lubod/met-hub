import fetch from "node-fetch";
import { IMeasurementDesc } from "../../common/measurementDesc";
import AuthData from "../auth/authData";
import ChartsData from "./chartsData";

// const ENV = process.env.ENV || "";

class ChartsCtrl {
  chartsData: ChartsData;

  authData: AuthData;

  constructor(chartsData: ChartsData, authData: AuthData) {
    this.chartsData = chartsData;
    this.authData = authData;
  }

  start() {}

  async reload() {
    this.load(
      this.chartsData.offset,
      this.chartsData.page,
      this.chartsData.measurement
    );
  }

  async load(of: string, p: number, m: IMeasurementDesc) {
    if (!this.authData.isAuth) {
      console.info("no load -> no auth");
      return;
    }
    const o = parseInt(of.split("|")[0], 10) * 1000;
    // eslint-disable-next-line no-promise-executor-return
    // return new Promise((resolve) => setTimeout(resolve, 2000));
    const start = new Date(Date.now() - o + p * o);
    const end = new Date(Date.now() + p * o);
    let url = `/api/loadData?start=${start.toISOString()}&end=${end.toISOString()}&measurement=${
      m.table
    }:${m.col}`;
    if (m.col2 !== "") {
      url += `:${m.col2}`;
    }
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
      let max: number = null;
      let min: number = null;
      let avg: string = null;
      let total: number = null;

      const range = this.chartsData.offset.split("|")[1];

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
      //      if (domainMin < 0 && couldBeNegative === false) {
      //      domainMin = 0; // todo
      //      }

      this.chartsData.setHdata(newData);
      this.chartsData.setCdata({
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
    } catch (e) {
      console.error(e);
    }
  }
}

export default ChartsCtrl;
