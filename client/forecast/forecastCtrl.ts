import AuthData from "../auth/authData";
import ForecastData from "./forecastData";

export default class ForecastCtrl {
  forecastData: ForecastData;

  authData: AuthData;

  timer: any;

  constructor(forecastData: ForecastData, authData: AuthData) {
    this.forecastData = forecastData;
    this.authData = authData;
  }

  start() {
    this.fetchData("48.2482", "17.0589"); // todo
    this.timer = setInterval(() => {
      this.fetchData(
        this.forecastData.coordinates[1],
        this.forecastData.coordinates[0]
      );
    }, 1800000);
  }

  async fetchData(lat: string, lon: string) {
    const url = `/api/getForecast?lat=${lat}&lon=${lon}`;
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
      this.forecastData.setForecast(newData);
    } catch (e) {
      console.error(e);
    }
  }
}
