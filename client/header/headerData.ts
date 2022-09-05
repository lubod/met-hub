import { action, makeObservable, observable } from "mobx";

export default class HeaderData {
  ctime: Date = new Date();

  place: string = "stanica";

  lat: string = "48.2482";

  lon: string = "17.0589";

  constructor() {
    makeObservable(this, {
      ctime: observable,
      place: observable,
      lat: observable,
      lon: observable,
      setTime: action,
      setPlace: action,
    });
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }

  setPlace(newPlace: string) {
    this.place = newPlace;
    if (newPlace === "stanica" || newPlace === "dom") {
      this.lat = "48.2482";
      this.lon = "17.0589";
    } else if (newPlace === "stanica2") {
      this.lat = "49.0342";
      this.lon = "19.5750";
    }
  }
}
