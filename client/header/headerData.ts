import { action, makeObservable, observable } from "mobx";

export default class HeaderData {
  ctime: Date = new Date();

  place: string = "stanica";

  constructor() {
    makeObservable(this, {
      ctime: observable,
      place: observable,
      setTime: action,
      setPlace: action,
    });
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }

  setPlace(newPlace: string) {
    this.place = newPlace;
  }
}
