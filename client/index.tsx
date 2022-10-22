/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import ReactDOM from "react-dom";
import AuthCtrl from "./auth/authCtrl";
import AuthData from "./auth/authData";
import MySocket from "./socket";
import StationData from "./station/stationData";
import StationCtrl from "./station/stationCtrl";
import HeaderData from "./header/headerData";
import HeaderCtrl from "./header/headerCtrl";
import App from "./app";
import ChartsData from "./charts/chartsData";
import ChartsCtrl from "./charts/chartsCtrl";
import { IMeasurementDesc } from "../common/measurementDesc";
import "bootstrap/dist/css/bootstrap.css";
import "./style.scss";
import ForecastData from "./forecast/forecastData";
import ForecastCtrl from "./forecast/forecastCtrl";
import { IController } from "../common/controller";
import DomData from "./dom/domData";
import DomCtrl from "./dom/domCtrl";
import { AllStationsCfgClient } from "../common/allStationsCfgClient";
import {
  STATION_MEASUREMENTS,
  STATION_MEASUREMENTS_DESC,
} from "../common/stationModel";

export class AppContext {
  socket: MySocket;

  authData: AuthData;

  authCtrl: AuthCtrl;

  headerData: HeaderData;

  headerCtrl: HeaderCtrl;

  chartsData: ChartsData;

  chartsCtrl: ChartsCtrl;

  stationData: StationData;

  stationCtrl: IController;

  domData: DomData;

  domCtrl: DomCtrl;

  forecastData: ForecastData;

  forecastCrtl: ForecastCtrl;

  start() {
    this.socket = new MySocket();
    this.authData = new AuthData();
    this.authCtrl = new AuthCtrl(this.authData);
    this.headerData = new HeaderData(
      AllStationsCfgClient.getDefaultStationID()
    );
    this.headerCtrl = new HeaderCtrl(this.headerData);
    this.chartsData = new ChartsData(
      AllStationsCfgClient.getDefaultStationID(),
      AllStationsCfgClient.getDefaultStation().lat,
      AllStationsCfgClient.getDefaultStation().lon,
      STATION_MEASUREMENTS_DESC.TEMPERATURE,
      STATION_MEASUREMENTS
    );
    this.chartsCtrl = new ChartsCtrl(this.chartsData, this.authData);
    this.stationData = new StationData(
      AllStationsCfgClient.getDefaultStationID()
    );
    this.stationCtrl = new StationCtrl(
      this.socket,
      this.stationData,
      this.authData,
      this.chartsCtrl
    );
    this.domData = new DomData();
    this.domCtrl = new DomCtrl(this.socket, this.domData, this.chartsCtrl);
    this.forecastData = new ForecastData(
      AllStationsCfgClient.getDefaultStationID(),
      AllStationsCfgClient.getDefaultStation().lat,
      AllStationsCfgClient.getDefaultStation().lon
    );
    this.forecastCrtl = new ForecastCtrl(this.forecastData, this.authData);

    this.authData.setCallWhenAuthetificated(() => {
      this.chartsCtrl.reload();
    });
    this.authCtrl.start();
    this.headerCtrl.start();
    this.chartsCtrl.start();
    this.stationCtrl.start();
    // this.domCtrl.start();
    this.forecastCrtl.start();
  }

  setMeasurementAndLoad(measurementDesc: IMeasurementDesc) {
    this.chartsData.setMeasurementObject(measurementDesc);
    this.chartsCtrl.reload();
  }
}

const appContext: AppContext = new AppContext();

// autorun(() => {
/* if (appContext.authData.isAuth === true) {
    appContext.chartsCtrl.reload();
  } */
// });

function render() {
  console.info(
    "Index render",
    appContext.authData.isAuth,
    window.location.pathname
  );
  appContext.authData.setLocation(window.location.pathname);

  const appContainer = document.getElementById("app");
  ReactDOM.render(
    <div className="App">
      <App appContext={appContext} />
    </div>,
    appContainer
  );
}

AllStationsCfgClient.fetchAllStationsCfg().then(() => {
  appContext.start();
  render();
});
