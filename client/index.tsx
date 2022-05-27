/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-import-module-exports */
import React from "react";
import ReactDOM from "react-dom";
import AuthCtrl from "./auth/authCtrl";
import AuthData from "./auth/authData";
import MySocket from "./socket";
import StationData from "./station/stationData";
import StationCtrl from "./station/stationCtrl";
import DomData from "./dom/domData";
import DomCtrl from "./dom/domCtrl";
import HeaderData from "./header/headerData";
import HeaderCtrl from "./header/headerCtrl";
import "./style.scss";
import "bootstrap/dist/css/bootstrap.css";
import App from "./app";

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
      />
    </div>,
    appContainer
  );
}

render();
