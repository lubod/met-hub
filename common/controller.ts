import { IStation } from "./allStationsCfg";

/* eslint-disable no-unused-vars */
export interface IController {
  setStation(station: IStation): any;

  start(): any;

  stop(): any;

  fetchData(): any;

  fetchTrendData(): any;

  fetchRainData(): any;
}
