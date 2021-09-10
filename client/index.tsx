import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { BrowserRouter } from 'react-router-dom';
import Auth from './auth';
import MySocket from './socket';
import { StationData } from './station/stationData';
import { StationCtrl } from './station/stationCtrl';
import { DomData } from './dom/domData';
import { DomCtrl } from './dom/domCtrl';

class AppContext {
  auth = new Auth();
}

const socket = new MySocket();
const appContext = new AppContext();

const stationData = new StationData();
const stationCtrl = new StationCtrl(socket, stationData);

const domData = new DomData();
const domCtrl = new DomCtrl(socket, domData);

export const AppContextP = React.createContext(appContext);
export const StationDataP = React.createContext<StationData>(stationData);
export const DomDataP = React.createContext<DomData>(domData);

function render() {
  console.info('Index render');

  const appContainer = document.getElementById('app');
  ReactDOM.render(
    <BrowserRouter>
      <AppContextP.Provider value={appContext}>
        <App />
      </AppContextP.Provider>
    </BrowserRouter >,
    appContainer);
}

render();

if (module.hot) {
  module.hot.accept('./App', render);
}
