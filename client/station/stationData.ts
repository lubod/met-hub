import { action, makeObservable, observable } from "mobx";
import { IStationData, IStationTrendData } from "../../common/stationModel";

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

  floatingRainData: boolean = false;

  raindata: any = null;

  try: number = 0;

  loading: boolean = true;

  constructor() {
    makeObservable(this, {
      data: observable,
      trendData: observable,
      oldData: observable,
      floatingRainData: observable,
      raindata: observable,
      loading: observable,
      processData: action,
      processTrendData: action,
      checkOldData: action,
      setLoading: action,
      setFloatingRainData: action,
      setRaindata: action,
    });
  }

  setRaindata(raindata: any) {
    this.raindata = raindata;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  checkOldData(time: Date) {
    if (this.data.timestamp) {
      const timestamp = new Date(this.data.timestamp);
      const diff = time.getTime() - timestamp.getTime();
      if (diff > 300000) {
        // console.info('oldData = true');
        this.oldData = true;
      } else {
        // console.info('oldData = false');
        this.oldData = false;
        this.try = 0;
      }
    } else {
      // console.info('oldData = true');
      this.oldData = true;
    }
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
    this.checkOldData(newTime);
  }

  setFloatingRainData(newFloatingRainData: boolean) {
    this.floatingRainData = newFloatingRainData;
  }

  processData(newData: IStationData) {
    // console.info("process station data", newData, this);
    if (newData != null) {
      this.data = newData;
      this.checkOldData(new Date());
      this.setLoading(false);
    }
  }

  processTrendData(newTrendData: IStationTrendData) {
    // console.info("process station trend data", newTrendData, this);
    if (newTrendData != null) {
      this.trendData = newTrendData;
    }
  }
}

export default StationData;
