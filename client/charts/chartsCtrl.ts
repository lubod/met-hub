import { ISensor } from "../../common/sensor";
import AuthData from "../auth/authData";
import ChartsData, { CData, IChartsRange } from "./chartsData";
import { IStation } from "../../common/allStationsCfg";

class ChartsCtrl {
  chartsData: ChartsData;

  authData: AuthData;

  timer: ReturnType<typeof setInterval> | null = null;

  // Monotonic token: responses from superseded loads are discarded.
  loadSeq: number = 0;

  constructor(authData: AuthData) {
    this.authData = authData;
    this.chartsData = new ChartsData();
  }

  setStation(station: IStation | null) {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.chartsData.setStation(station);
    if (station != null) {
      this.reload();
      this.timer = setInterval(() => {
        this.reload();
      }, 60000);
    }
  }

  start() {}

  async reload() {
    if (this.chartsData.station == null) {
      return;
    }
    this.load(
      this.chartsData.range,
      this.chartsData.page,
      this.chartsData.sensor,
      this.chartsData.station.id,
    );
  }

  async load(range: IChartsRange, p: number, m: ISensor | null, stationID: string | null) {
    if (this.chartsData.station == null) {
      console.debug("no station -> no load");
      return;
    }
    const hasDomAccess =
      this.chartsData.station.id === "dom" &&
      this.authData.isAuth &&
      this.authData.email?.toLowerCase() === "lubo.drobny@gmail.com";

    if (
      !this.chartsData.station.public &&
      !hasDomAccess &&
      (!this.authData.isAuth ||
        (this.authData.id !== this.chartsData.station.owner &&
          !this.authData.isAdmin))
    ) {
      console.debug("no auth -> no load");
      return;
    }
    if (m == null || stationID == null) {
      console.debug("no stationID -> no load");
      return;
    }
    const seq = ++this.loadSeq;
    try {
      this.chartsData.setLoading(true);
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
      console.debug(url);

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Keep last-good chart/stats; surface in console only.
        throw new Error(`An error has occured: ${response.status}`);
      }

      const newData = await response.json();
      if (seq !== this.loadSeq) return;
      if (newData == null) return;
      const num = (v: unknown): number | null => {
        const parsed = v != null ? parseFloat(String(v)) : Number.NaN;
        return Number.isFinite(parsed) ? parsed : null;
      };
      const min = num(newData.stats.min);
      const max = num(newData.stats.max);
      const last = num(newData.stats.last);
      const first = num(newData.stats.first);
      const avg = num(newData.stats.avg);
      const total: number | null = null;
      // const y = m.col;
      const y2 = m.col2;
      const sum: number | null = total;
      let yDomainMin = min !== null && max !== null ? Math.floor(min - (max / 100) * 5) : 0;
      const yDomainMax = min !== null && max !== null ? Math.ceil(max + (max / 100) * 5) : 0;
      //      const last = newData.length > 0 ? newData[newData.length - 1][y] : null;

      if (y2 !== "") {
        yDomainMin = 0;
      }

      for (const item of newData.data) {
        item.val = [item.min, item.max];
      }
      // console.debug("loaded data", min, max, avg, sum, newData);

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
    } catch (e) {
      console.error(e);
    } finally {
      if (seq === this.loadSeq) this.chartsData.setLoading(false);
    }
  }
}

export default ChartsCtrl;
