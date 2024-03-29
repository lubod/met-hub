import { ISensor } from "../../common/sensor";
import AuthData from "../auth/authData";
import ChartsData, { CData, IChartsRange } from "./chartsData";
import { IStation } from "../../common/allStationsCfg";

class ChartsCtrl {
  chartsData: ChartsData;

  authData: AuthData;

  timer: any;

  constructor(authData: AuthData) {
    this.authData = authData;
    this.chartsData = new ChartsData();
  }

  setStation(station: IStation) {
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
      this.chartsData.sensor,
      this.chartsData.station.id,
    );
  }

  async load(range: IChartsRange, p: number, m: ISensor, stationID: string) {
    if (!this.authData.isAuth) {
      console.info("no auth -> no load");
      return;
    }
    if (
      this.authData.id !== this.chartsData.station.owner &&
      this.authData.id !== this.authData.admin
    ) {
      console.info("no owner -> no load");
      return;
    }
    if (m == null || stationID == null) {
      console.info("no stationID -> no load");
      return;
    }
    try {
      const o = range.sec * 1000;
      // eslint-disable-next-line no-promise-executor-return
      // return new Promise((resolve) => setTimeout(resolve, 2000));
      const start = new Date(Date.now() - o + p * o);
      const end = new Date(Date.now() + p * o);
      let url = `/api/loadData?stationID=${stationID}&start=${start.toISOString()}&end=${end.toISOString()}&measurement=`;
      url += `${m.col}`;
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
        this.chartsData.setNewData(true, [], new CData());
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const newData = await response.json();
      if (newData == null) {
        this.chartsData.setNewData(true, [], new CData());
        return;
      }
      const min = newData.stats.min ? parseFloat(newData.stats.min) : null;
      const max = newData.stats.max ? parseFloat(newData.stats.max) : null;
      const last = newData.stats.last ? parseFloat(newData.stats.last) : null;
      const first = newData.stats.first
        ? parseFloat(newData.stats.first)
        : null;
      const avg: number = newData.stats.avg
        ? parseFloat(newData.stats.avg)
        : null;

      const total: number = null;
      // const y = m.col;
      const y2 = m.col2;
      const sum = total;
      let yDomainMin = Math.floor(min - (max / 100) * 5);
      const yDomainMax = Math.ceil(max + (max / 100) * 5);
      //      const last = newData.length > 0 ? newData[newData.length - 1][y] : null;

      if (y2 !== "") {
        yDomainMin = 0;
      }

      for (const item of newData.data) {
        item.val = [item.min, item.max];
      }
      // console.info("loaded data", min, max, avg, sum, newData);

      this.chartsData.setNewData(false, newData.data, {
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
        first,
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
