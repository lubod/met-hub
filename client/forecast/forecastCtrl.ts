import { AllStationsCfgClient } from "../../common/allStationsCfgClient";
import AuthData from "../auth/authData";
import ForecastData from "./forecastData";

export default class ForecastCtrl {
  forecastData: ForecastData;

  authData: AuthData;

  timer: any;

  constructor(stationID: string, authData: AuthData) {
    this.forecastData = new ForecastData(
      stationID,
      AllStationsCfgClient.getStationByID(stationID).lat, // todo
      AllStationsCfgClient.getStationByID(stationID).lon
    );
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

  async fetchData() {
    this.forecastData.forecast = null;
    const url = `/api/getForecast?lat=${this.forecastData.lat}&lon=${this.forecastData.lon}`;
    console.info(url);

    try {
      this.forecastData.setLoading(true);
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
      // console.info(newData);
      this.forecastData.setForecast(newData);
      this.forecastData.setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  async fetchAstronomicalData(date: Date) {
    this.forecastData.astronomicalData = null;
    const url = `/api/getAstronomicalData?lat=${this.forecastData.lat}&lon=${
      this.forecastData.lon
    }&date=${date.toISOString()}`;
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
      // console.info(newData);
      this.forecastData.setAstronomicalData(newData);
    } catch (e) {
      console.error(e);
    }
  }
}
