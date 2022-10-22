import { action, makeObservable, observable } from "mobx";

export default class HeaderData {
  ctime: Date = new Date();

  stationID: string = null;

  constructor(defaultStationID: string) {
    makeObservable(this, {
      ctime: observable,
      stationID: observable,
      setTime: action,
      setStationID: action,
    });
    this.stationID = defaultStationID;
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }

  setStationID(stationID: string) {
    this.stationID = stationID;
  }
}
