/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import ReactDOM from "react-dom";
import AuthCtrl from "./auth/authCtrl";
import MySocket from "./socket";
import StationCtrl from "./station/stationCtrl";
import HeaderCtrl from "./header/headerCtrl";
import App from "./app";
import ChartsCtrl from "./charts/chartsCtrl";
import { IMeasurementDesc } from "../common/measurementDesc";
import ForecastCtrl from "./forecast/forecastCtrl";
import DomCtrl from "./dom/domCtrl";
import { AllStationsCfgClient } from "../common/allStationsCfgClient";
import "./style.scss";

export class AppContext {
  socket: MySocket;

  authCtrl: AuthCtrl;

  headerCtrl: HeaderCtrl;

  chartsCtrl: ChartsCtrl;

  stationCtrl: StationCtrl;

  domCtrl: DomCtrl;

  forecastCtrl: ForecastCtrl;

  start() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    console.info("External station ID", id);
    const externalStation = AllStationsCfgClient.getStationByID(id);
    const lastStation = AllStationsCfgClient.getStationByID(
      localStorage.getItem("lastStationID")
    );
    let headerStationID = AllStationsCfgClient.getDefaultStationID();
    let isExternalID = false;
    if (lastStation != null && lastStation.public) {
      headerStationID = lastStation.id;
    }
    if (externalStation != null && externalStation.public) {
      headerStationID = externalStation.id;
      isExternalID = true;
    }
    this.socket = new MySocket();
    this.authCtrl = new AuthCtrl();
    this.headerCtrl = new HeaderCtrl(headerStationID, isExternalID);
    this.chartsCtrl = new ChartsCtrl(headerStationID, this.authCtrl.authData);
    this.stationCtrl = new StationCtrl(
      this.socket,
      headerStationID,
      this.authCtrl.authData
    );
    this.domCtrl = new DomCtrl(this.socket, this.authCtrl.authData);

    this.forecastCtrl = new ForecastCtrl(
      headerStationID,
      this.authCtrl.authData
    );

    this.authCtrl.authData.setCallWhenAuthetificated(() => {
      // todo
      this.chartsCtrl.reload();
    });
    this.authCtrl.start();
    this.headerCtrl.start();
    this.chartsCtrl.start();
    this.stationCtrl.start();
    // this.domCtrl.start();
    this.forecastCtrl.start();
  }

  setMeasurementAndLoad(measurementDesc: IMeasurementDesc) {
    this.chartsCtrl.chartsData.setMeasurementObject(measurementDesc);
    this.chartsCtrl.reload();
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
      <App appContext={appContext} />
    </div>,
    appContainer
  );
}

AllStationsCfgClient.fetchAllStationsCfg().then(() => {
  appContext.start();
  render();
});
