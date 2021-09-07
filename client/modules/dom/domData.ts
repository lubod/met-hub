import { IDomData, IDomTrendData } from '../../models/domModel';
import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

var self: DomData;

export class DomData {
    data: IDomData = {} as IDomData;
    trendData: IDomTrendData = {} as IDomTrendData;

    constructor() {
        makeObservable(this, {
            data: observable,
            trendData: observable,
            processData: action,
            processTrendData: action
        });
        this.trendData.timestamp = new Array<string>();
        this.trendData.temp = new Array<number>();
        this.trendData.humidity = new Array<number>();
        this.trendData.rain = new Array<number>();
        this.trendData.obyvacka_vzduch = new Array<number>();
        this.trendData.obyvacka_podlaha = new Array<number>();
        this.trendData.pracovna_vzduch = new Array<number>();
        this.trendData.pracovna_podlaha = new Array<number>();
        this.trendData.spalna_vzduch = new Array<number>();
        this.trendData.spalna_podlaha = new Array<number>();
        this.trendData.chalani_vzduch = new Array<number>();
        this.trendData.chalani_podlaha = new Array<number>();
        this.trendData.petra_vzduch = new Array<number>();
        this.trendData.petra_podlaha = new Array<number>();
        self = this;
    }

    processData(newData: IDomData) {
        console.info('process dom data', newData, this, self);
        if (newData != null) {
            const sdate = new Date(newData.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
            const stime = new Date(newData.timestamp).toLocaleTimeString('sk-SK');

            newData.time = stime;
            newData.date = sdate.substring(0, sdate.length - 6);
            self.data = newData;
        }
    }

    processTrendData(newData: IDomTrendData) {
        console.info('process dom trend data', newData, this, self);
        if (newData != null) {
            self.trendData = newData;
        }
    }
}
