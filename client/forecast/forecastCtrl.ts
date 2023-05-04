import AuthData from "../auth/authData";
import ForecastData from "./forecastData";
import { IStation } from "../../common/allStationsCfg";

export default class ForecastCtrl {
  forecastData: ForecastData;

  authData: AuthData;

  timer: any;

  constructor(authData: AuthData) {
    this.forecastData = new ForecastData();
    this.authData = authData;
  }

  start() {
    this.fetchData();
    this.fetchAstronomicalData(new Date());
    this.timer = setInterval(() => {
      this.fetchData();
      this.fetchAstronomicalData(new Date());
    }, 1800000);
  }

  setStation(station:IStation) {
    this.forecastData.setStation(station);
    this.fetchData();
    this.fetchAstronomicalData(new Date());
  }

  async fetchData() {
    this.forecastData.forecast = null;
    if (this.forecastData.station == null) {
      console.info("no station -> no forecast");
      return;
    }
    const url = `/api/getForecast?lat=${this.forecastData.station.lat}&lon=${this.forecastData.station.lon}`;
    console.info(url);

    try {
      this.forecastData.setLoading(true);
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
      // console.info(newData);
      this.forecastData.setForecast(newData);
      this.forecastData.setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchAstronomicalData(date: Date) {
    this.forecastData.astronomicalData = null;
    if (this.forecastData.station == null) {
      console.info("no station -> no astronomical data");
      return;
    }
    const url = `/api/getAstronomicalData?lat=${
      this.forecastData.station.lat
    }&lon=${this.forecastData.station.lon}&date=${date.toISOString()}`;
    console.info(url);

    try {
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
      // console.info(newData);
      this.forecastData.setAstronomicalData(newData);
    } catch (e) {
      console.error(e);
    }
  }
}
