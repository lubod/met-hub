/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import ReactDOM from "react-dom";
import { autorun } from "mobx";
import AuthCtrl from "./auth/authCtrl";
import AuthData from "./auth/authData";
import MySocket from "./socket";
import StationData from "./station/stationData";
import StationCtrl from "./station/stationCtrl";
import DomData from "./dom/domData";
import DomCtrl from "./dom/domCtrl";
import HeaderData from "./header/headerData";
import HeaderCtrl from "./header/headerCtrl";
import App from "./app";
import "bootstrap/dist/css/bootstrap.css";
import "./style.scss";
import ChartsData from "./charts/chartsData";
import ChartsCtrl from "./charts/chartsCtrl";
import { STATION_MEASUREMENTS_DESC } from "../common/stationModel";
import { DOM_MEASUREMENTS_DESC } from "../common/domModel";

const socket = new MySocket();

const stationData = new StationData();
const stationCtrl = new StationCtrl(socket, stationData);
stationCtrl.start();

const domData = new DomData();
const domCtrl = new DomCtrl(socket, domData);
domCtrl.start();

const authData = new AuthData();
const authCtrl = new AuthCtrl(authData);
authCtrl.start();

const headerData = new HeaderData();
const headerCtrl = new HeaderCtrl(headerData);
headerCtrl.start();

const chartsData = new ChartsData();
const chartsCtrl = new ChartsCtrl(chartsData, authData);
chartsCtrl.start();

autorun(() => {
  console.log("Autorun:", chartsData.measurement);
  chartsCtrl.load(chartsData.offset, chartsData.page, chartsData.measurement);
});

autorun(() => {
  console.log("Autorun:", headerData.place);
  if (headerData.place === "stanica") {
    chartsData.setMeasurementObject(STATION_MEASUREMENTS_DESC.TEMPERATURE);
  } else if (headerData.place === "dom") {
    chartsData.setMeasurementObject(DOM_MEASUREMENTS_DESC.LIVING_ROOM_AIR);
  }
});

autorun(() => {
  console.log("Autorun:", stationData.trendData);
  if (headerData.place === "stanica") {
    setTimeout(
      () =>
        chartsCtrl.load(
          chartsData.offset,
          chartsData.page,
          chartsData.measurement
        ),
      2000
    );
  }
});

autorun(() => {
  console.log("Autorun:", domData.trendData);
  if (headerData.place === "dom") {
    setTimeout(
      () =>
        chartsCtrl.load(
          chartsData.offset,
          chartsData.page,
          chartsData.measurement
        ),
      2000
    );
  }
});

function render() {
  console.info("Index render", authData.isAuth, window.location.pathname);
  authData.setLocation(window.location.pathname);

  const appContainer = document.getElementById("app");
  ReactDOM.render(
    <div className="App">
      <App
        headerData={headerData}
        stationData={stationData}
        domData={domData}
        authData={authData}
        authCtrl={authCtrl}
        chartsData={chartsData}
      />
    </div>,
    appContainer
  );
}

render();
