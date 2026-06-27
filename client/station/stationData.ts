import { action, makeObservable, observable } from "mobx";
import { IStationData, IStationTrendData } from "../../common/stationModel";
import { IStation } from "../../common/allStationsCfg";

class StationData {
  data: IStationData = {} as IStationData;

  trendData: IStationTrendData = {
    timestamp: [],
    tempin: [],
    humidityin: [],
    temp: [],
    humidity: [],
    pressureabs: [],
    pressurerel: [],
    windgust: [],
    windspeed: [],
    winddir: [],
    solarradiation: [],
    uv: [],
    rainrate: [],
    minuterain: [],
    maxdailygust: [],
    eventrain: [],
    hourlyrain: [],
    dailyrain: [],
    weeklyrain: [],
    monthlyrain: [],
    totalrain: [],
    feelslike: [],
    dewpt: [],
  } as IStationTrendData;

  ctime: Date = new Date();

  oldData: boolean = true;

  floatingRainData: boolean = false;

  inData: boolean = false;

  raindata: any = null;

  dailyET0: { et0: number; rain: number } | null = null;

  try: number = 0;

  loading: boolean = true;

  station: IStation | null = null;

  constructor() {
    makeObservable(this, {
      data: observable,
      trendData: observable,
      oldData: observable,
      floatingRainData: observable,
      inData: observable,
      raindata: observable,
      dailyET0: observable,
      loading: observable,
      station: observable,
      setData: action,
      setTrendData: action,
      checkOldData: action,
      setLoading: action,
      setFloatingRainData: action,
      setRaindata: action,
      setDailyET0: action,
      setStation: action,
      setInData: action,
    });
  }

  setStation(station: IStation | null) {
    this.station = station;
    this.ctime = new Date();
    this.oldData = true;
    this.floatingRainData = false;
    this.raindata = null;
    this.dailyET0 = null;
    this.try = 0;
    this.loading = true;
  }

  setRaindata(raindata: any) {
    this.raindata = raindata;
  }

  setDailyET0(dailyET0: { et0: number; rain: number } | null) {
    this.dailyET0 = dailyET0;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  checkOldData(time: Date) {
    if (this.data.timestamp) {
      const timestamp = new Date(this.data.timestamp);
      const diff = time.getTime() - timestamp.getTime();
      if (diff > 300000) {
        // console.debug('oldData = true');
        this.oldData = true;
      } else {
        // console.debug('oldData = false');
        this.oldData = false;
        this.try = 0;
      }
    } else {
      // console.debug('oldData = true');
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

  setInData(newInData: boolean) {
    this.inData = newInData;
  }

  setData(newData: IStationData) {
    // console.debug("process station data", newData, this);
    if (newData != null) {
      this.data = newData;
      this.data.timestamp = new Date(newData.timestamp);
      this.checkOldData(new Date());
    } else {
      this.data = {} as IStationData;
    }
  }

  setTrendData(newTrendData: IStationTrendData) {
    // console.debug("process station trend data", newTrendData, this);
    if (newTrendData != null) {
      this.trendData = newTrendData;
    } else {
      this.trendData = {
        timestamp: [],
        tempin: [],
        humidityin: [],
        temp: [],
        humidity: [],
        pressureabs: [],
        pressurerel: [],
        windgust: [],
        windspeed: [],
        winddir: [],
        solarradiation: [],
        uv: [],
        rainrate: [],
        minuterain: [],
        maxdailygust: [],
        eventrain: [],
        hourlyrain: [],
        dailyrain: [],
        weeklyrain: [],
        monthlyrain: [],
        totalrain: [],
        feelslike: [],
        dewpt: [],
      } as IStationTrendData;
    }
  }
}

export default StationData;
