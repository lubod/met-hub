/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import ReactDOM from "react-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthCtrl from "./auth/authCtrl";
import MySocket from "./socket";
import StationCtrl from "./station/stationCtrl";
import HeaderCtrl from "./header/headerCtrl";
import App from "./app";
import ChartsCtrl from "./charts/chartsCtrl";
import { ISensor } from "../common/sensor";
import ForecastCtrl from "./forecast/forecastCtrl";
import DomCtrl from "./dom/domCtrl";
import "./style.scss";
import { IStation } from "../common/allStationsCfg";
import { AllStationsCfgClient } from "../common/allStationsCfgClient";
import { DOM_SENSORS, DOM_SENSORS_DESC } from "../common/domModel";
import {
  STATION_SENSORS,
  STATION_MEASUREMENTS_DESC,
} from "../common/stationModel";

export class AppContext {
  socket: MySocket;

  authCtrl: AuthCtrl;

  headerCtrl: HeaderCtrl;

  chartsCtrl: ChartsCtrl;

  stationCtrl: StationCtrl;

  domCtrl: DomCtrl;

  forecastCtrl: ForecastCtrl;

  start() {
    this.socket = new MySocket();
    this.authCtrl = new AuthCtrl(this);
    this.headerCtrl = new HeaderCtrl(this);
    this.chartsCtrl = new ChartsCtrl(this.authCtrl.authData);
    this.stationCtrl = new StationCtrl(this.socket, this.authCtrl.authData);
    this.domCtrl = new DomCtrl(this.socket, this.authCtrl.authData);
    this.forecastCtrl = new ForecastCtrl(this.authCtrl.authData);
    this.authCtrl.start();
    this.headerCtrl.start();
    this.chartsCtrl.start();
    this.stationCtrl.start();
    this.domCtrl.start(); // todo
    this.forecastCtrl.start();
    // SSE
    const source = new EventSource(`/events`);
    source.addEventListener("message", (e) => {
      console.info("EVENT ", e.data);
      if (e.data === this.stationCtrl.stationCfg.STATION_ID) {
        console.info("ME");
        this.stationCtrl.fetchData(); // todo
      }
    });
    source.addEventListener("error", (e) => {
      console.error("Error: ", e);
    });
  }

  setMeasurementAndLoad(measurementDesc: ISensor) {
    this.chartsCtrl.chartsData.setMeasurementObject(measurementDesc);
    this.chartsCtrl.reload();
  }

  setStation(station: IStation) {
    console.info("stationID", station);
    if (station != null) {
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
        this.stationCtrl.setStation(station);
      }
    }

    this.headerCtrl.setStation(station);
    this.forecastCtrl.setStation(station);
    this.stationCtrl.setStation(station);
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
}

const appContext: AppContext = new AppContext();

function render() {
  console.info(
    "Index render",
    appContext.authCtrl.authData.isAuth,
    window.location.pathname,
  );
  appContext.authCtrl.authData.setLocation(window.location.pathname);

  const appContainer = document.getElementById("app");
  ReactDOM.render(
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <App appContext={appContext} />
      </GoogleOAuthProvider>
    </div>,
    appContainer,
  );
}

appContext.start();
render();
