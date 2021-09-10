import { IDomData, IDomTrendData } from '../../common/models/domModel';
import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";

export class DomData {
    data: IDomData = {} as IDomData;
    trendData: IDomTrendData = {
        timestamp: new Array<string>(),
        temp: new Array<number>(),
        humidity: new Array<number>(),
        rain: new Array<number>(),
        obyvacka_vzduch: new Array<number>(),
        obyvacka_podlaha: new Array<number>(),
        pracovna_vzduch: new Array<number>(),
        pracovna_podlaha: new Array<number>(),
        spalna_vzduch: new Array<number>(),
        spalna_podlaha: new Array<number>(),
        chalani_vzduch: new Array<number>(),
        chalani_podlaha: new Array<number>(),
        petra_vzduch: new Array<number>(),
        petra_podlaha: new Array<number>(),
    } as IDomTrendData;

    constructor() {
        makeObservable(this, {
            data: observable,
            trendData: observable,
            processData: action,
            processTrendData: action
        });
    }

    processData(newData: IDomData) {
        console.info('process dom data', newData, this);
        if (newData != null) {
            const sdate = new Date(newData.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
            const stime = new Date(newData.timestamp).toLocaleTimeString('sk-SK');

            newData.time = stime;
            newData.date = sdate.substring(0, sdate.length - 6);
            this.data = newData;
        }
    }

    processTrendData(newTrendData: IDomTrendData) {
        console.info('process dom trend data', newTrendData, this);
        if (newTrendData != null) {
            this.trendData = newTrendData;
        }
    }
}
