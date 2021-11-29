/* eslint-disable import/no-import-module-exports */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import Auth from './auth';
import MySocket from './socket';
import StationData from './station/stationData';
import StationCtrl from './station/stationCtrl';
import DomData from './dom/domData';
import DomCtrl from './dom/domCtrl';
import AppData from './appData';

class AppContext {
  auth = new Auth();
}

const socket = new MySocket();
const appContext = new AppContext();

const stationData = new StationData();
const stationCtrl = new StationCtrl(socket, stationData);
stationCtrl.start();

const domData = new DomData();
const domCtrl = new DomCtrl(socket, domData);
domCtrl.start();

const appData = new AppData();

export const AppContextP = React.createContext(appContext);
export const StationDataP = React.createContext<StationData>(stationData);
export const DomDataP = React.createContext<DomData>(domData);
export const AppDataP = React.createContext<AppData>(appData);

function render() {
  console.info('Index render');

  const appContainer = document.getElementById('app');
  ReactDOM.render(
    <BrowserRouter>
      <AppContextP.Provider value={appContext}>
        <App />
      </AppContextP.Provider>
    </BrowserRouter>,
    appContainer,
  );
}

render();

if (module.hot) {
  module.hot.accept('./App', render);
}
