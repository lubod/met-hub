/* eslint-disable max-classes-per-file */
import { action, makeObservable, observable } from "mobx";
import { IMeasurementDesc } from "../../common/measurementDesc";
import { IStation } from "../../common/allStationsCfg";

export class CData {
  min: number;

  max: number;

  avg: string;

  sum: string;

  yDomainMin: number;

  yDomainMax: number;

  label: string;

  unit: string;

  range: string;

  couldBeNegative: boolean;

  last: string;

  xDomainMin: string;

  xDomainMax: string;
}

class ChartsData {
  hdata: any = null;

  cdata: CData = new CData();

  page: number = 0;

  range: string = "86400|1 day";

  measurement: IMeasurementDesc = null;

  measurements: IMeasurementDesc[] = null;

  loading: boolean = true;

  station: IStation = null;

  constructor() {
    makeObservable(this, {
      hdata: observable,
      cdata: observable,
      page: observable,
      range: observable,
      measurement: observable,
      measurements: observable,
      loading: observable,
      station: observable,
      setHdata: action,
      setCdata: action,
      setMeasurement: action,
      setMeasurements: action,
      setMeasurementObject: action,
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

  setMeasurement(measurement: string) {
    this.measurement = JSON.parse(measurement);
  }

  setMeasurements(measurements: IMeasurementDesc[]) {
    this.measurements = measurements;
  }

  setMeasurementObject(measurement: IMeasurementDesc) {
    this.measurement = measurement;
  }

  setRange(range: string) {
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
