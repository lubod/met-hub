import { makeObservable, observable } from "mobx";

export default class HeaderData {
  ctime: Date = new Date();

  constructor() {
    makeObservable(this, {
      ctime: observable,
    });
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }
}
