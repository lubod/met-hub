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
import { IMeasurementDesc } from "../common/measurementDesc";
import ForecastCtrl from "./forecast/forecastCtrl";
import DomCtrl from "./dom/domCtrl";
import "./style.scss";
import { IStation } from "../common/allStationsCfg";
import { AllStationsCfgClient } from "../common/allStationsCfgClient";
import { DOM_MEASUREMENTS, DOM_MEASUREMENTS_DESC } from "../common/domModel";
import { STATION_MEASUREMENTS, STATION_MEASUREMENTS_DESC } from "../common/stationModel";

export class AppContext {
  socket: MySocket;

  authCtrl: AuthCtrl;

  headerCtrl: HeaderCtrl;

  chartsCtrl: ChartsCtrl;

  stationCtrl: StationCtrl;

  domCtrl: DomCtrl;

  forecastCtrl: ForecastCtrl;

  start() {
    //    const queryParams = new URLSearchParams(window.location.search);
    //    const id = queryParams.get("id");
    //    console.info("External station ID", id);
    //    const externalStation = AllStationsCfgClient.getStationByID(id);
    //    const lastStation = AllStationsCfgClient.getStationByID(
    //      localStorage.getItem("lastStationID")
    //    );
    //    let headerStationID = AllStationsCfgClient.getDefaultStationID();
    //    let isExternalID = false;
    //    if (lastStation != null && lastStation.public) {
    //      headerStationID = lastStation.id;
    //    }
    //    if (externalStation != null && externalStation.public) {
    //      headerStationID = externalStation.id;
    //      isExternalID = true;
    //    }
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
    this.forecastCtrl.start();
  }

  setMeasurementAndLoad(measurementDesc: IMeasurementDesc) {
    this.chartsCtrl.chartsData.setMeasurementObject(measurementDesc);
    this.chartsCtrl.reload();
  }

  setStation(station: IStation) {
    console.info("stationID", station);
    if (station != null) {
      localStorage.setItem("lastStationID", station.id);
      if (station.id === "dom") {
        this.chartsCtrl.chartsData.setMeasurements(DOM_MEASUREMENTS);
        this.chartsCtrl.chartsData.setMeasurementObject(
          DOM_MEASUREMENTS_DESC.LIVING_ROOM_AIR
        );
        this.stationCtrl.stop();
        this.domCtrl.start();
      } else {
        // todo
        this.chartsCtrl.chartsData.setMeasurements(STATION_MEASUREMENTS);
        this.chartsCtrl.chartsData.setMeasurementObject(
          STATION_MEASUREMENTS_DESC.TEMPERATURE
        );
        this.domCtrl.stop();
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
    if (cfg != null) {
      let lastStation: IStation = AllStationsCfgClient.getStationByID(
        localStorage.getItem("lastStationID")
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
    window.location.pathname
  );
  appContext.authCtrl.authData.setLocation(window.location.pathname);

  const appContainer = document.getElementById("app");
  ReactDOM.render(
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <App appContext={appContext} />
      </GoogleOAuthProvider>
    </div>,
    appContainer
  );
}

appContext.start();
render();
