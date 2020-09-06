import { observable, action } from 'mobx';

export class StationData {
    timestamp: string = '';
    time: string = '';
    date: string = '';
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

export class DomData {
    timestamp: string = '';
    time: string = '';
    date: string = '';
    temp: string = '';
    humidity: string = '';
    rain: string = '';
    place: string = '';
    obyvacka_vzduch: string = '';
    obyvacka_podlaha: string = '';
    obyvacka_req: string = '';
    obyvacka_kuri: string = '';
    obyvacka_leto: string = '';
    obyvacka_low: string = '';
    pracovna_vzduch: string = '';
    pracovna_podlaha: string = '';
    pracovna_req: string = '';
    pracovna_kuri: string = '';
    pracovna_leto: string = '';
    pracovna_low: string = '';
    spalna_vzduch: string = '';
    spalna_podlaha: string = '';
    spalna_req: string = '';
    spalna_kuri: string = '';
    spalna_leto: string = '';
    spalna_low: string = '';
    chalani_vzduch: string = '';
    chalani_podlaha: string = '';
    chalani_req: string = '';
    chalani_kuri: string = '';
    chalani_leto: string = '';
    chalani_low: string = '';
    petra_vzduch: string = '';
    petra_podlaha: string = '';
    petra_req: string = '';
    petra_kuri: string = '';
    petra_leto: string = '';
    petra_low: string = '';
}

export class StationModel {
    @observable stationData = new StationData();
}

export class DomModel {
    @observable domData = new DomData();
}