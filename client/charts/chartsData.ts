/* eslint-disable max-classes-per-file */
import { action, makeObservable, observable } from "mobx";
import { ISensor } from "../../common/sensor";
import { IStation } from "../../common/allStationsCfg";

export interface IChartsRange {
  display: string;
  sec: number;
  format: string;
}

export class CData {
  min: number;

  max: number;

  avg: number;

  sum: number;

  yDomainMin: number;

  yDomainMax: number;

  label: string;

  unit: string;

  range: IChartsRange;

  couldBeNegative: boolean;

  last: number;

  first: number;

  xDomainMin: string;

  xDomainMax: string;
}

export const chartsRanges: Array<IChartsRange> = [
  { display: "1 hour", sec: 3600, format: "HH:mm" },
  { display: "3 hours", sec: 3600 * 3, format: "HH:mm" },
  { display: "6 hours", sec: 3600 * 6, format: "HH:mm" },
  { display: "12 hours", sec: 3600 * 12, format: "HH:mm" },
  { display: "1 day", sec: 3600 * 24, format: "HH:mm" },
  { display: "3 days", sec: 3600 * 24 * 3, format: "HH:mm" },
  { display: "1 week", sec: 3600 * 24 * 7, format: "DD.MM" },
  { display: "4 weeks", sec: 3600 * 24 * 7 * 4, format: "DD.MM" },
  { display: "1 year", sec: 3600 * 24 * 365, format: "MMM" },
];

class ChartsData {
  hdata: any = null;

  cdata: CData = new CData();

  page: number = 0;

  range: IChartsRange = chartsRanges[4];

  sensor: ISensor = null;

  allSensors: ISensor[] = null;

  loading: boolean = true;

  station: IStation = null;

  constructor() {
    makeObservable(this, {
      hdata: observable,
      cdata: observable,
      page: observable,
      range: observable,
      sensor: observable,
      allSensors: observable,
      loading: observable,
      station: observable,
      setHdata: action,
      setCdata: action,
      setSensor: action,
      setAllSensors: action,
      setRange: action,
      setPage: action,
      setLoading: action,
      setStation: action,
      setNewData: action,
    });
  }

  setStation(station: IStation) {
    this.station = station;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setHdata(newHdata: any) {
    this.hdata = newHdata;
  }

  setCdata(newCdata: CData) {
    this.cdata = newCdata;
  }

  setSensor(sensor: ISensor) {
    this.sensor = sensor;
  }

  setAllSensors(measurements: ISensor[]) {
    this.allSensors = measurements;
  }

  setRange(range: IChartsRange) {
    this.range = range;
  }

  setPage(page: number) {
    this.page = page;
  }

  setNewData(loading: boolean, newHdata: any, newCdata: CData) {
    this.hdata = newHdata;
    this.cdata = newCdata;
    this.loading = loading;
  }
}

export default ChartsData;
