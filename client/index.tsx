/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./errorBoundary";
import { GoogleOAuthProvider } from "@react-oauth/google";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReconnectingEventSource from "reconnecting-eventsource";
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
    // const source = new EventSource(`/events`);
    const source = new ReconnectingEventSource("/events");
    source.addEventListener("message", this.listener);
    source.addEventListener("open", () => {
      console.info("SSE connected");
    });
    source.addEventListener("error", (e) => {
      console.warn("SSE error/reconnecting:", e);
    });
  }

  setMeasurementAndLoad(measurementDesc: ISensor) {
    this.chartsCtrl.chartsData.setSensor(measurementDesc);
    this.chartsCtrl.reload();
  }

  setStation(station: IStation) {
    console.info("stationID", station);
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
    } else if (cfg != null && cfg.length > 0) {
      const lastStation =
        AllStationsCfgClient.getStationByID(localStorage.getItem("lastStationID"))
        ?? cfg[0];
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
      <ErrorBoundary>
        <div className="App">
          <div className="bg-aurora" />
          <div className="bg-terrain">
            <svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mount1" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0a0d22" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="mount2" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0a0d22" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="mount3" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0a0d22" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Back mountains - raised high */}
              <path d="M0,150 Q180,30 360,90 T720,40 T1080,120 T1440,70 L1440,320 L0,320 Z" fill="url(#mount1)" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.8" />
              {/* Mid mountains - raised medium */}
              <path d="M0,190 Q240,70 480,130 T960,80 T1440,150 L1440,320 L0,320 Z" fill="url(#mount2)" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.85" />
              {/* Front mountains - raised low */}
              <path d="M0,230 Q360,110 720,170 T1440,160 L1440,320 L0,320 Z" fill="url(#mount3)" stroke="#06b6d4" strokeWidth="2.5" strokeOpacity="0.9" />
            </svg>
          </div>
          <div className="bg-grid" />
          <div className="bg-grid-overlay" />
          <div className="grain-overlay" />
          <div className="edge-glow" />
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <App appContext={this} />
          </GoogleOAuthProvider>
        </div>
      </ErrorBoundary>,
    );
  }
}

const appContext: AppContext = new AppContext();
appContext.start();
appContext.render();
