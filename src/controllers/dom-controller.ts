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
            this.model.domData = {
                timestamp: new Date(json.timestamp).toLocaleString('sk-SK'),
                time: new Date(json.timestamp).toLocaleTimeString('sk-SK'),
                date: new Date(json.timestamp).toLocaleDateString('sk-SK').replace(' ', ''),
                temp: parseFloat(json.vonku.temp).toFixed(1),
                humidity: parseFloat(json.vonku.humidity).toFixed(0),
                rain: parseFloat(json.vonku.rain).toFixed(0),
                place: 'Marianka',
                obyvacka_vzduch: parseFloat(json.obyvacka_vzduch.temp).toFixed(1),
                obyvacka_podlaha: parseFloat(json.obyvacka_podlaha.temp).toFixed(1),
                obyvacka_req: parseFloat(json.obyvacka_vzduch.req).toFixed(1),
                obyvacka_kuri: parseFloat(json.obyvacka_podlaha.kuri).toFixed(0),
                obyvacka_leto: parseFloat(json.obyvacka_podlaha.leto).toFixed(0),
                obyvacka_low: parseFloat(json.obyvacka_podlaha.low).toFixed(0),
                pracovna_vzduch: parseFloat(json.pracovna_vzduch.temp).toFixed(1),
                pracovna_podlaha: parseFloat(json.pracovna_podlaha.temp).toFixed(1),
                pracovna_req: parseFloat(json.pracovna_vzduch.req).toFixed(1),
                pracovna_kuri: parseFloat(json.pracovna_podlaha.kuri).toFixed(0),
                pracovna_leto: parseFloat(json.pracovna_podlaha.leto).toFixed(0),
                pracovna_low: parseFloat(json.pracovna_podlaha.low).toFixed(0),
                spalna_vzduch: parseFloat(json.spalna_vzduch.temp).toFixed(1),
                spalna_podlaha: parseFloat(json.spalna_podlaha.temp).toFixed(1),
                spalna_req: parseFloat(json.spalna_vzduch.req).toFixed(1),
                spalna_kuri: parseFloat(json.spalna_podlaha.kuri).toFixed(0),
                spalna_leto: parseFloat(json.spalna_podlaha.leto).toFixed(0),
                spalna_low: parseFloat(json.spalna_podlaha.low).toFixed(0),
                chalani_vzduch: parseFloat(json.chalani_vzduch.temp).toFixed(1),
                chalani_podlaha: parseFloat(json.chalani_podlaha.temp).toFixed(1),
                chalani_req: parseFloat(json.chalani_vzduch.req).toFixed(1),
                chalani_kuri: parseFloat(json.chalani_podlaha.kuri).toFixed(0),
                chalani_leto: parseFloat(json.chalani_podlaha.leto).toFixed(0),
                chalani_low: parseFloat(json.chalani_podlaha.low).toFixed(0),
                petra_vzduch: parseFloat(json.petra_vzduch.temp).toFixed(1),
                petra_podlaha: parseFloat(json.petra_podlaha.temp).toFixed(1),
                petra_req: parseFloat(json.petra_vzduch.req).toFixed(1),
                petra_kuri: parseFloat(json.petra_podlaha.kuri).toFixed(0),
                petra_leto: parseFloat(json.petra_podlaha.leto).toFixed(0),
                petra_low: parseFloat(json.petra_podlaha.low).toFixed(0)
            };
        });
    }
}  