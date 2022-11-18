import { action, makeObservable, observable } from "mobx";

export default class HeaderData {
  ctime: Date = new Date();

  stationID: string = null;

  isExternalID: boolean = false;

  constructor(defaultStationID: string, isExternalID: boolean) {
    makeObservable(this, {
      ctime: observable,
      stationID: observable,
      isExternalID: observable,
      setTime: action,
      setStationID: action,
    });
    this.stationID = defaultStationID;
    this.isExternalID = isExternalID;
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }

  setIsExternalID(isExternalID: boolean) {
    this.isExternalID = isExternalID;
  }

  setStationID(stationID: string) {
    this.stationID = stationID;
  }
}
