import { IStationData, IStationTrendData } from '../../models/stationModel';
import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

var self: StationData;

export class StationData {
    data: IStationData = {} as IStationData;
    trendData: IStationTrendData = {} as IStationTrendData;

    constructor() {
        makeObservable(this, {
            data: observable,
            trendData: observable,
            processData: action,
            processTrendData: action
        });
        this.trendData.timestamp = new Array<string>();
        this.trendData.tempin = new Array<number>();
        this.trendData.humidityin = new Array<number>();
        this.trendData.temp = new Array<number>();
        this.trendData.humidity = new Array<number>();
        this.trendData.pressurerel = new Array<number>();
        this.trendData.windgust = new Array<number>();
        this.trendData.windspeed = new Array<number>();
        this.trendData.winddir = new Array<number>();
        this.trendData.solarradiation = new Array<number>();
        this.trendData.uv = new Array<number>();
        this.trendData.rainrate = new Array<number>();
        self = this;
    }

    processData(newData: IStationData) {
        console.info('process station data', newData, this, self);
        if (newData != null) {
            const sdate = new Date(newData.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
            const stime = new Date(newData.timestamp).toLocaleTimeString('sk-SK');

            newData.time = stime;
            newData.date = sdate.substring(0, sdate.length - 6);
            self.data = newData;
        }
    }

    processTrendData(newData: IStationTrendData) {
        console.info('process station trend data', newData, this, self);
        if (newData != null) {
            self.trendData = newData;
        }
    }
}
