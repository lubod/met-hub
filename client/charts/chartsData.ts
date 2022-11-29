/* eslint-disable max-classes-per-file */
import { action, makeObservable, observable } from "mobx";
import { IMeasurementDesc } from "../../common/measurementDesc";

export class CData {
  min: number;

  max: number;

  avg: string;

  sum: string;

  domainMin: number;

  domainMax: number;

  label: string;

  unit: string;

  range: string;

  couldBeNegative: boolean;

  last: string;
}

class ChartsData {
  hdata: any = null;

  cdata: CData = new CData();

  page: number = 0;

  range: string = "86400|1 day";

  measurement: IMeasurementDesc = null;

  measurements: IMeasurementDesc[] = null;

  loading: boolean = true;

  stationID: string = null;

  lat: number = null;

  lon: number = null;

  constructor(
    stationID: string,
    lat: number,
    lon: number,
    measurement: IMeasurementDesc,
    measurements: IMeasurementDesc[]
  ) {
    makeObservable(this, {
      hdata: observable,
      cdata: observable,
      page: observable,
      range: observable,
      measurement: observable,
      measurements: observable,
      loading: observable,
      stationID: observable,
      lat: observable,
      lon: observable,
      setHdata: action,
      setCdata: action,
      setMeasurement: action,
      setMeasurements: action,
      setMeasurementObject: action,
      setOffset: action,
      setPage: action,
      setLoading: action,
      setStationID: action,
    });
    this.stationID = stationID;
    this.lat = lat;
    this.lon = lon;
    this.measurement = measurement;
    this.measurements = measurements;
  }

  setStationID(stationID: string, lat: number, lon: number) {
    this.stationID = stationID;
    this.lat = lat;
    this.lon = lon;
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

  setOffset(offset: string) {
    this.range = offset;
  }

  setPage(page: number) {
    this.page = page;
  }
}

export default ChartsData;
