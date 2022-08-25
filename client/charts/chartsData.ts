/* eslint-disable max-classes-per-file */
import { action, makeObservable, observable } from "mobx";
import { IMeasurementDesc } from "../../common/measurementDesc";
import {
  STATION_MEASUREMENTS,
  STATION_MEASUREMENTS_DESC,
} from "../../common/stationModel";

class CData {
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

  offset: string = "86400|1 day";

  measurement: IMeasurementDesc = STATION_MEASUREMENTS_DESC.TEMPERATURE;

  measurements: IMeasurementDesc[] = STATION_MEASUREMENTS;

  constructor() {
    makeObservable(this, {
      hdata: observable,
      cdata: observable,
      page: observable,
      offset: observable,
      measurement: observable,
      measurements: observable,
      setHdata: action,
      setCdata: action,
      setMeasurement: action,
      setMeasurements: action,
      setMeasurementObject: action,
      setOffset: action,
      setPage: action,
    });
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
    this.offset = offset;
  }

  setPage(page: number) {
    this.page = page;
  }
}

export default ChartsData;
