/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthCtrl from "./auth/authCtrl";
import HeaderCtrl from "./header/headerCtrl";
import App from "./app";
import ChartsCtrl from "./charts/chartsCtrl";
import { ISensor } from "../common/sensor";
import ForecastCtrl from "./forecast/forecastCtrl";
import "./style.scss";
import { IStation } from "../common/allStationsCfg";
import { AllStationsCfgClient } from "../common/allStationsCfgClient";
import { DOM_SENSORS, DOM_SENSORS_DESC } from "../common/domModel";
import {
  STATION_SENSORS,
  STATION_MEASUREMENTS_DESC,
} from "../common/stationModel";
import { CController } from "../common/controller";

export class AppContext {
  authCtrl: AuthCtrl;

  headerCtrl: HeaderCtrl;

  chartsCtrl: ChartsCtrl;

  cCtrl: CController;

  forecastCtrl: ForecastCtrl;

  listener = (e: any) => {
    const [data, type] = e.data.split(":");
    // console.info("EVENT ", data, type);
    if (data === this.cCtrl.getStationID()) {
      console.info("SSE ME");
      if (type === "raw") {
        this.cCtrl.fetchData(); // todo
      } else if (type === "minute") {
        this.cCtrl.fetchTrendData();
      }
    }
  };

  start() {
    this.authCtrl = new AuthCtrl(this);
    this.headerCtrl = new HeaderCtrl(this);
    this.chartsCtrl = new ChartsCtrl(this.authCtrl.authData);
    this.cCtrl = new CController(this.authCtrl.authData);
    this.forecastCtrl = new ForecastCtrl(this.authCtrl.authData);
    this.authCtrl.start();
    this.headerCtrl.start();
    this.chartsCtrl.start();
    this.cCtrl.start();
    this.forecastCtrl.start();
    // SSE
    let source = new EventSource(`/events`);
    source.addEventListener("message", this.listener);
    source.addEventListener("error", (e) => {
      console.error("Error: ", e);
      setTimeout(() => {
        source = new EventSource(`/events`);
      }, 60000);
    });
  }

  setMeasurementAndLoad(measurementDesc: ISensor) {
    this.chartsCtrl.chartsData.setMeasurementObject(measurementDesc);
    this.chartsCtrl.reload();
  }

  setStation(station: IStation) {
    console.info("stationID", station);
    localStorage.setItem("lastStationID", station.id);
    if (station.id === "dom") {
      this.chartsCtrl.chartsData.setMeasurements(DOM_SENSORS);
      this.chartsCtrl.chartsData.setMeasurementObject(
        DOM_SENSORS_DESC.LIVING_ROOM_AIR,
      );
    } else {
      // todo
      this.chartsCtrl.chartsData.setMeasurements(STATION_SENSORS);
      this.chartsCtrl.chartsData.setMeasurementObject(
        STATION_MEASUREMENTS_DESC.TEMPERATURE,
      );
    }

    this.headerCtrl.setStation(station);
    this.forecastCtrl.setStation(station);
    this.cCtrl.setStation(station);
    this.cCtrl.fetchData();
    this.cCtrl.fetchTrendData();
    this.chartsCtrl.setStation(station);
  }

  async fetchCfg() {
    console.info("fetch cfg");
    const cfg = await AllStationsCfgClient.fetchAllStationsCfg();
    this.headerCtrl.setAllStations(cfg);

    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    console.info("External station ID", id);
    const externalStation = AllStationsCfgClient.getStationByID(id);
    if (externalStation != null && externalStation.public) {
      this.setStation(externalStation);
      this.headerCtrl.headerData.setIsExternalID(true);
    } else if (cfg != null) {
      let lastStation: IStation = AllStationsCfgClient.getStationByID(
        localStorage.getItem("lastStationID"),
      );
      if (lastStation == null) {
        // eslint-disable-next-line prefer-destructuring
        lastStation = cfg[0];
      }
      this.setStation(lastStation);
    } else {
      this.setStation(null);
    }
  }

  render() {
    console.info(
      "Index render",
      this.authCtrl.authData.isAuth,
      window.location.pathname,
    );
    this.authCtrl.authData.setLocation(window.location.pathname);

    const appContainer = document.getElementById("app");
    const root = createRoot(appContainer); // createRoot(container!) if you use TypeScript
    root.render(
      <div className="App">
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <App appContext={this} />
        </GoogleOAuthProvider>
      </div>,
    );
  }
}

const appContext: AppContext = new AppContext();
appContext.start();
appContext.render();
