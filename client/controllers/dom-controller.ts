import { DomModel } from '../models/model';

export class DomController {

    constructor(private model: DomModel) {
        this.getData();

        setInterval(() => {
            this.getData();
        }, 5000);
    }

    getData() {
        fetch('/getLastData/dom').then(data => data.json()).then(json => {
            if (json != null) {
                this.model.domData = {
                    timestamp: json.timestamp,
                    time: new Date(json.timestamp).toLocaleTimeString('sk-SK'),
                    date: new Date(json.timestamp).toLocaleDateString('sk-SK').replace(' ', ''),
                    temp: json.vonku.temp,
                    humidity: json.vonku.humidity,
                    rain: json.vonku.rain,
                    place: 'Dom',
                    obyvacka_vzduch: json.obyvacka_vzduch.temp,
                    obyvacka_podlaha: json.obyvacka_podlaha.temp,
                    obyvacka_req: json.obyvacka_vzduch.req,
                    obyvacka_kuri: json.obyvacka_podlaha.kuri,
                    obyvacka_leto: json.obyvacka_podlaha.leto,
                    obyvacka_low: json.obyvacka_podlaha.low,
                    pracovna_vzduch: json.pracovna_vzduch.temp,
                    pracovna_podlaha: json.pracovna_podlaha.temp,
                    pracovna_req: json.pracovna_vzduch.req,
                    pracovna_kuri: json.pracovna_podlaha.kuri,
                    pracovna_leto: json.pracovna_podlaha.leto,
                    pracovna_low: json.pracovna_podlaha.low,
                    spalna_vzduch: json.spalna_vzduch.temp,
                    spalna_podlaha: json.spalna_podlaha.temp,
                    spalna_req: json.spalna_vzduch.req,
                    spalna_kuri: json.spalna_podlaha.kuri,
                    spalna_leto: json.spalna_podlaha.leto,
                    spalna_low: json.spalna_podlaha.low,
                    chalani_vzduch: json.chalani_vzduch.temp,
                    chalani_podlaha: json.chalani_podlaha.temp,
                    chalani_req: json.chalani_vzduch.req,
                    chalani_kuri: json.chalani_podlaha.kuri,
                    chalani_leto: json.chalani_podlaha.leto,
                    chalani_low: json.chalani_podlaha.low,
                    petra_vzduch: json.petra_vzduch.temp,
                    petra_podlaha: json.petra_podlaha.temp,
                    petra_req: json.petra_vzduch.req,
                    petra_kuri: json.petra_podlaha.kuri,
                    petra_leto: json.petra_podlaha.leto,
                    petra_low: json.petra_podlaha.low
                }
            };
        });
        fetch('/getTrendData/dom').then(data => data.json()).then(json => {
            if (json != null) {
                this.model.domTrendData.timestamp = json.timestamp;
                this.model.domTrendData.temp = json.temp;
                this.model.domTrendData.humidity = json.humidity;
                this.model.domTrendData.rain = json.rain;
                this.model.domTrendData.obyvacka_vzduch = json.obyvacka_vzduch;
                this.model.domTrendData.obyvacka_podlaha = json.obyvacka_podlaha;
                this.model.domTrendData.pracovna_vzduch = json.pracovna_vzduch;
                this.model.domTrendData.pracovna_podlaha = json.pracovna_podlaha;
                this.model.domTrendData.spalna_vzduch = json.spalna_vzduch;
                this.model.domTrendData.spalna_podlaha = json.spalna_podlaha;
                this.model.domTrendData.chalani_vzduch = json.chalani_vzduch;
                this.model.domTrendData.chalani_podlaha = json.chalani_podlaha;
                this.model.domTrendData.petra_vzduch = json.petra_vzduch;
                this.model.domTrendData.petra_podlaha = json.petra_podlaha;
            }
        });
    }
}  