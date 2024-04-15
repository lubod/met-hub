import { action, makeObservable, observable } from "mobx";
import { IDomData, IDomTrendData } from "../../common/domModel";
import { IStation } from "../../common/allStationsCfg";

class DomData {
  data: IDomData = {} as IDomData;

  trendData: IDomTrendData = {
    timestamp: [],
    temp: [],
    humidity: [],
    rain: [],
    living_room_air: [],
    living_room_floor: [],
    guest_room_air: [],
    guest_room_floor: [],
    bed_room_air: [],
    bed_room_floor: [],
    boys_room_air: [],
    boys_room_floor: [],
    petra_room_air: [],
    petra_room_floor: [],
  } as IDomTrendData;

  ctime: Date = new Date();

  oldData: boolean = true;

  try: number = 0;

  loading: boolean = true;

  station: IStation = null;

  upDown = false;

  constructor() {
    makeObservable(this, {
      data: observable,
      trendData: observable,
      oldData: observable,
      loading: observable,
      upDown: observable,
      processData: action,
      processTrendData: action,
      checkOldData: action,
      setLoading: action,
      setUpDown: action,
    });
  }

  setUpDown(upDown: boolean) {
    this.upDown = upDown;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setStation(station: IStation) {
    this.station = station;
    this.ctime = new Date();
    this.oldData = true;
    this.try = 0;
    this.loading = true;
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

  processData(newData: IDomData) {
    // console.info("process dom data", newData, this);
    if (newData != null) {
      this.data = newData;
      this.checkOldData(new Date());
    }
    this.loading = false;
  }

  processTrendData(newTrendData: IDomTrendData) {
    // console.info("process dom trend data", newTrendData, this);
    if (newTrendData != null) {
      this.trendData = newTrendData;
    }
  }
}

export default DomData;
