import fetch from "node-fetch";
import { IMeasurementDesc } from "../../common/measurementDesc";
import AuthData from "../auth/authData";
import ChartsData, { CData } from "./chartsData";
import { IStation } from "../../common/allStationsCfg";

class ChartsCtrl {
  chartsData: ChartsData;

  authData: AuthData;

  timer: any;

  constructor(authData: AuthData) {
    this.authData = authData;
    this.chartsData = new ChartsData();
  }

  setStation(station:IStation) {
    this.chartsData.setStation(station);
    this.reload();
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
      this.chartsData.station.id
    );
  }

  async load(of: string, p: number, m: IMeasurementDesc, stationID: string) {
    if (!this.authData.isAuth) {
      console.info("no auth -> no load");
      return;
    }
    if (m == null || stationID == null) {
      console.info("no stationID -> no load");
      return;
    }
    try {
      this.chartsData.setNewData(true, [], new CData());
      const o = parseInt(of.split("|")[0], 10) * 1000;
      // eslint-disable-next-line no-promise-executor-return
      // return new Promise((resolve) => setTimeout(resolve, 2000));
      const start = new Date(Date.now() - o + p * o);
      const end = new Date(Date.now() + p * o);
      let url = `/api/loadData?stationID=${stationID}&start=${start.toISOString()}&end=${end.toISOString()}&measurement=${
        m.table
      }`;
      url += `:${m.col}`;
      if (m.col2 !== "") {
        url += `:${m.col2}`;
      }
      console.info(url);

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
        newData[i].timestamp = new Date(newData[i].timestamp).getTime();
      }
      avg = total != null ? (total / newData.length).toFixed(1) : "";
      const sum = total != null ? total.toFixed(1) : "";
      let yDomainMin = Math.floor(min - (max / 100) * 5);
      const yDomainMax = Math.ceil(max + (max / 100) * 5);
      const last = newData.length > 0 ? newData[newData.length - 1][y] : null;

      if (y2 !== "") {
        yDomainMin = 0;
      }

      //  console.info("loaded data", min, max, avg, sum, newData);

      this.chartsData.setNewData(false, newData, {
        min,
        max,
        avg,
        sum,
        yDomainMin,
        yDomainMax,
        label: m.label,
        unit: m.unit,
        range,
        couldBeNegative: m.couldBeNegative,
        last,
        xDomainMin: start.toISOString(),
        xDomainMax: end.toISOString(),
      });
      // this.chartsData.setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }
}

export default ChartsCtrl;
