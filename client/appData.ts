import { makeObservable, observable } from "mobx";

class AppData {
  ctime: Date = new Date();

  timer: any;

  constructor() {
    makeObservable(this, {
      ctime: observable,
    });

    this.timer = setInterval(() => {
      this.setTime(new Date());
    }, 1000);
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }
}

export default AppData;
