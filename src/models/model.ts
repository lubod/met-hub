import { observable, action } from 'mobx';

export class StationData {
    timestamp: string = '';
    time: string = '';
    date: string = '';
    place: string = '';
    tempin: number;
    humidityin: number;
    temp: number;
    humidity: number;
    pressurerel: number;
    pressureabs: number;
    windgust: number;
    windspeed: number;
    winddir: number;
    maxdailygust: number;
    solarradiation: number;
    uv: number;
    rainrate: number;
    eventrain: number;
    hourlyrain: number;
    dailyrain: number;
    weeklyrain: number;
    monthlyrain: number;
    totalrain: number;
}

export class StationTrendData {
    timestamp: Array<string> = new Array<string>();
    tempin: Array<number> = new Array<number>();
    humidityin: Array<number> = new Array<number>();
    temp: Array<number> = new Array<number>();
    humidity: Array<number> = new Array<number>();
    pressurerel: Array<number> = new Array<number>();
    windgust: Array<number> = new Array<number>();
    windspeed: Array<number> = new Array<number>();
    winddir: Array<number> = new Array<number>();
    solarradiation: Array<number> = new Array<number>();
    uv: Array<number> = new Array<number>();
    rainrate: Array<number> = new Array<number>();
}

export class DomData {
    timestamp: string = '';
    time: string = '';
    date: string = '';
    place: string = '';
    temp: number;
    humidity: number;
    rain: number;
    obyvacka_vzduch: number;
    obyvacka_podlaha: number;
    obyvacka_req: number;
    obyvacka_kuri: number;
    obyvacka_leto: number;
    obyvacka_low: number;
    pracovna_vzduch: number;
    pracovna_podlaha: number;
    pracovna_req: number;
    pracovna_kuri: number;
    pracovna_leto: number;
    pracovna_low: number;
    spalna_vzduch: number;
    spalna_podlaha: number;
    spalna_req: number;
    spalna_kuri: number;
    spalna_leto: number;
    spalna_low: number;
    chalani_vzduch: number;
    chalani_podlaha: number;
    chalani_req: number;
    chalani_kuri: number;
    chalani_leto: number;
    chalani_low: number;
    petra_vzduch: number;
    petra_podlaha: number;
    petra_req: number;
    petra_kuri: number;
    petra_leto: number;
    petra_low: number;
}

export class StationModel {
    @observable stationData = new StationData();
    @observable stationTrendData = new StationTrendData();
}

export class DomModel {
    @observable domData = new DomData();
}