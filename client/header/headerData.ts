import { action, makeObservable, observable } from "mobx";

export default class HeaderData {
  ctime: Date = new Date();

  id: string = "station_1";

  lat: string = "48.2482";

  lon: string = "17.0589";

  constructor() {
    makeObservable(this, {
      ctime: observable,
      id: observable,
      lat: observable,
      lon: observable,
      setTime: action,
      setId: action,
    });
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }

  setId(newId: string) {
    this.id = newId;
    if (newId === "station_1" || newId === "dom") {
      // todo
      this.lat = "48.2482";
      this.lon = "17.0589";
    } else if (newId === "station_2") {
      this.lat = "49.0342";
      this.lon = "19.5750";
    }
  }
}
