import {
  action, makeObservable, observable,
} from 'mobx';
import { IDomData, IDomTrendData } from '../../common/models/domModel';

class DomData {
  data: IDomData = {} as IDomData;

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

  constructor() {
    makeObservable(this, {
      data: observable,
      trendData: observable,
      processData: action,
      processTrendData: action,
      setTime: action,
    });
  }

  processData(newData: IDomData) {
    console.info('process dom data', newData, this);
    if (newData != null) {
      const sdate = new Date(newData.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
      const stime = new Date(newData.timestamp).toLocaleTimeString('sk-SK');

      this.data = newData;
      this.data.time = stime;
      this.data.date = sdate.substring(0, sdate.length - 6);
    }
  }

  processTrendData(newTrendData: IDomTrendData) {
    console.info('process dom trend data', newTrendData, this);
    if (newTrendData != null) {
      this.trendData = newTrendData;
    }
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }
}

export default DomData;
