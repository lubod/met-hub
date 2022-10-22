/* eslint-disable no-unused-vars */
export interface IController {
  setStation(stationID: string): any;

  start(): any;

  stop(): any;

  fetchData(): any;

  fetchTrendData(): any;

  fetchRainData(): any;
}
