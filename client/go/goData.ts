/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { action, makeObservable, observable } from "mobx";
import ForecastData from "../forecast/forecastData";

export default class GoData {
  forecastData: Array<ForecastData> = [];

  constructor() {
    makeObservable(this, {
      forecastData: observable,
      setForecastData: action,
    });
  }

  setForecastData(newForecast: any) {
    const fd = new ForecastData(null, 0, 0);
    fd.setForecast(newForecast);
  }
}
