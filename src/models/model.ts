import { observable, action } from 'mobx';

export class StationData {
    timestamp: string = '';
    tempin: string = '';
    humidityin: string = '';
    temp: string = '';
    humidity: string = '';
    pressurerel: string = '';
    pressureabs: string = '';
    windgust: string = '';
    windspeed: string = '';
    winddir: string = '';
    maxdailygust: string = '';
    solarradiation: string = '';
    uv: string = '';
    rainrate: string = '';
    eventrain: string = '';
    hourlyrain: string = '';
    dailyrain: string = '';
    weeklyrain: string = '';
    monthlyrain: string = '';
    totalrain: string = '';
    place: string = '';
}

export class Model {
    @observable stationData = new StationData();
}