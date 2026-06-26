/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReconnectingEventSource from "reconnecting-eventsource";
import { ErrorBoundary } from "./errorBoundary";
import AuthCtrl from "./auth/authCtrl";
import HeaderCtrl from "./header/headerCtrl";
import App from "./app";
import ChartsCtrl from "./charts/chartsCtrl";
import { ISensor } from "../common/sensor";
import ForecastCtrl from "./forecast/forecastCtrl";
import "./styles.css";
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

  listener = (e: MessageEvent) => {
    const parts = (e.data as string).split(":");
    if (parts.length < 2) return;
    const [data, type] = parts;
    if (data === this.cCtrl.getStationID()) {
      if (type === "raw") {
        this.cCtrl.fetchData();
      } else if (type === "minute") {
        this.cCtrl.fetchTrendData();
      }
    }
  };

  constructor() {
    this.authCtrl = new AuthCtrl(this);
    this.headerCtrl = new HeaderCtrl(this);
    this.chartsCtrl = new ChartsCtrl(this.authCtrl.authData);
    this.cCtrl = new CController(this.authCtrl.authData);
    this.forecastCtrl = new ForecastCtrl(this.authCtrl.authData);
  }

  start() {
    this.authCtrl.start();
    this.headerCtrl.start();
    this.chartsCtrl.start();
    this.cCtrl.start();
    this.forecastCtrl.start();
    // SSE
    const source = new ReconnectingEventSource("/events");
    source.addEventListener("message", this.listener);
    source.addEventListener("open", () => {
      console.debug("SSE connected");
    });
    source.addEventListener("error", (e) => {
      console.warn("SSE error/reconnecting:", e);
    });
  }

  setMeasurementAndLoad(measurementDesc: ISensor) {
    this.chartsCtrl.chartsData.setSensor(measurementDesc);
    this.chartsCtrl.reload();
  }

  setStation(station: IStation | null) {
    console.debug("stationID", station);
    if (station == null) {
      this.headerCtrl.setStation(null);
      this.forecastCtrl.setStation(null);
      this.cCtrl.setStation(null);
      this.chartsCtrl.setStation(null);
      return;
    }
    localStorage.setItem("lastStationID", station.id);
    if (station.id === "dom") {
      this.chartsCtrl.chartsData.setAllSensors(DOM_SENSORS);
      this.chartsCtrl.chartsData.setSensor(DOM_SENSORS_DESC.LIVING_ROOM_AIR);
    } else {
      // todo
      this.chartsCtrl.chartsData.setAllSensors(STATION_SENSORS);
      this.chartsCtrl.chartsData.setSensor(
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
    console.debug("fetch cfg");
    const cfg = await AllStationsCfgClient.fetchAllStationsCfg();
    this.headerCtrl.setAllStations(cfg);

    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    console.debug("External station ID", id);
    const externalStation = AllStationsCfgClient.getStationByID(id);
    if (externalStation != null && externalStation.public) {
      this.setStation(externalStation);
      this.headerCtrl.headerData.setIsExternalID(true);
    } else if (cfg != null && cfg.length > 0) {
      const lastId = localStorage.getItem("lastStationID");
      const lastStation = cfg.find((s) => s.id === lastId) ?? cfg[0];
      this.setStation(lastStation);
    } else {
      this.setStation(null);
    }
  }

}

const appContext: AppContext = new AppContext();
appContext.start();
appContext.authCtrl.authData.setLocation(window.location.pathname);

const appContainer = document.getElementById("app");
if (appContainer) {
  const root = createRoot(appContainer);
  root.render(
    <ErrorBoundary>
      <div className="App">
        <div className="bg-aurora" />
        <div className="bg-terrain" />
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
          <App appContext={appContext} />
        </GoogleOAuthProvider>
      </div>
    </ErrorBoundary>,
  );
}
