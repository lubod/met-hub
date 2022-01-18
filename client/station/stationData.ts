import { action, makeObservable, observable } from "mobx";
import {
  IStationData,
  IStationTrendData,
} from "../../common/models/stationModel";

class StationData {
  data: IStationData = {
    timestamp: "",
  } as IStationData;

  trendData: IStationTrendData = {
    timestamp: [],
    tempin: [],
    humidityin: [],
    temp: [],
    humidity: [],
    pressurerel: [],
    windgust: [],
    windspeed: [],
    winddir: [],
    solarradiation: [],
    uv: [],
    rainrate: [],
  } as IStationTrendData;

  ctime: Date = new Date();

  oldData: boolean = true;

  constructor() {
    makeObservable(this, {
      data: observable,
      trendData: observable,
      ctime: observable,
      processData: action,
      processTrendData: action,
      setTime: action,
      setOldData: action,
    });
  }

  setOldData(time: Date) {
    if (this.data.timestamp) {
      const timestamp = new Date(this.data.timestamp);
      const diff = time.getTime() - timestamp.getTime();
      if (diff > 180000) {
        // console.info('oldData = true');
        this.oldData = true;
      } else {
        // console.info('oldData = false');
        this.oldData = false;
      }
    } else {
      // console.info('oldData = true');
      this.oldData = true;
    }
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
    this.setOldData(newTime);
  }

  processData(newData: IStationData) {
    console.info("process station data", newData, this);
    if (newData != null) {
      const sdate = new Date(newData.timestamp)
        .toLocaleDateString("sk-SK")
        .replace(" ", "");
      const stime = new Date(newData.timestamp).toLocaleTimeString("sk-SK");

      this.data = newData;
      this.data.time = stime;
      this.data.date = sdate.substring(0, sdate.length - 6);
      this.setOldData(new Date());
    }
  }

  processTrendData(newTrendData: IStationTrendData) {
    console.info("process station trend data", newTrendData, this);
    if (newTrendData != null) {
      this.trendData = newTrendData;
    }
  }
}

export default StationData;
