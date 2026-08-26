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

  setStation(station: IStation | null) {
    this.forecastData.setStation(station);
    this.fetchData();
    this.fetchAstronomicalData(new Date());
  }

  async fetchData() {
    if (this.forecastData.station == null) {
      console.debug("no station -> no forecast");
      return;
    }
    // Capture identity before awaiting; a station switch supersedes us.
    const { station } = this.forecastData;
    const url = `/api/getForecast?lat=${station.lat}&lon=${station.lon}`;
    console.debug(url);

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
      if (this.forecastData.station !== station) return;
      // No pre-clear: last-good forecast stays visible on failure.
      this.forecastData.setForecast(newData);
    } catch (e) {
      console.error(e);
    } finally {
      this.forecastData.setLoading(false);
    }
  }

  async fetchAstronomicalData(date: Date) {
    if (this.forecastData.station == null) {
      console.debug("no station -> no astronomical data");
      return;
    }
    const { station } = this.forecastData;
    const url = `/api/getAstronomicalData?lat=${
      station.lat
    }&lon=${station.lon}&date=${date.toISOString()}`;
    console.debug(url);

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
      if (this.forecastData.station !== station) return;
      this.forecastData.setAstronomicalData(newData);
    } catch (e) {
      console.error(e);
    }
  }
}
