/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import ReactDOM from "react-dom";
// import { autorun } from "mobx";
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
import { StationGoGenMe3900Cfg } from "../common/stationGoGenMe3900Cfg";
import { IController } from "../common/controller";
import DomData from "./dom/domData";
import DomCtrl from "./dom/domCtrl";

export class AppContext {
  socket: MySocket = new MySocket();

  authData: AuthData = new AuthData();

  authCtrl: AuthCtrl = new AuthCtrl(this.authData);

  headerData: HeaderData = new HeaderData();

  headerCtrl: HeaderCtrl = new HeaderCtrl(this.headerData);

  chartsData: ChartsData = new ChartsData();

  chartsCtrl: ChartsCtrl = new ChartsCtrl(this.chartsData, this.authData);

  stationData: StationData = new StationData();

  stationCtrl: IController = new StationCtrl(
    this.socket,
    this.stationData,
    this.authData,
    this.chartsCtrl,
    new StationGoGenMe3900Cfg()
  );

  domData: DomData = new DomData();

  domCtrl: DomCtrl = new DomCtrl(this.socket, this.domData, this.chartsCtrl);

  forecastData: ForecastData = new ForecastData();

  forecastCrtl: ForecastCtrl = new ForecastCtrl(
    this.forecastData,
    this.authData
  );

  start() {
    this.authData.setCallWhenAuthetificated(() => {
      this.chartsCtrl.reload();
    });
    this.authCtrl.start();
    this.headerCtrl.start();
    this.chartsCtrl.start();
    this.stationCtrl.start();
    this.domCtrl.start();
    this.forecastCrtl.start();
  }

  setMeasurementAndLoad(measurementDesc: IMeasurementDesc) {
    this.chartsData.setMeasurementObject(measurementDesc);
    this.chartsCtrl.reload();
  }
}

const appContext: AppContext = new AppContext();
appContext.start();

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

render();
