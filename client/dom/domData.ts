import { action, makeObservable, observable } from "mobx";
import { IDomData, IDomTrendData } from "../../common/domModel";

class DomData {
  data: IDomData = { timestamp: "" } as IDomData;

  trendData: IDomTrendData = {
    timestamp: [],
    temp: [],
    humidity: [],
    rain: [],
    obyvacka_vzduch: [],
    obyvacka_podlaha: [],
    pracovna_vzduch: [],
    pracovna_podlaha: [],
    spalna_vzduch: [],
    spalna_podlaha: [],
    chalani_vzduch: [],
    chalani_podlaha: [],
    petra_vzduch: [],
    petra_podlaha: [],
  } as IDomTrendData;

  ctime: Date = new Date();

  oldData: boolean = true;

  try: number = 0;

  loading: boolean = true;

  constructor() {
    makeObservable(this, {
      data: observable,
      trendData: observable,
      oldData: observable,
      loading: observable,
      processData: action,
      processTrendData: action,
      checkOldData: action,
      setLoading: action,
    });
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
