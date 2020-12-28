import Auth from '../auth';
import Socket from '../socket';
import { DomModel } from '../models/model';

export class DomController {
    constructor(private model: DomModel, private auth: Auth, private socket: Socket) {
        //        this.getData();
        console.info('dom ctrl');

        let self = this;
        this.socket.getSocket().on('dom', function (json: any) {
            self.processData(json);
        });

        this.socket.getSocket().on('domTrend', function (json: any) {
            self.processTrendData(json);
        });
    }

    processData(json: any) {
//        console.info(json);
        if (json != null) {
            const sdate = new Date(json.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
            const stime = new Date(json.timestamp).toLocaleTimeString('sk-SK');

            this.model.domData = {
                timestamp: json.timestamp,
                time: stime.substring(0, stime.length - 3),
                date: sdate.substring(0, sdate.length - 6),
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
    }

    processTrendData(json: any) {
//        console.info(json);
        if (json != null) {
            this.model.domTrendData = {
                timestamp: json.timestamp,
                temp: json.temp,
                humidity: json.humidity,
                rain: json.rain,
                obyvacka_vzduch: json.obyvacka_vzduch,
                obyvacka_podlaha: json.obyvacka_podlaha,
                pracovna_vzduch: json.pracovna_vzduch,
                pracovna_podlaha: json.pracovna_podlaha,
                spalna_vzduch: json.spalna_vzduch,
                spalna_podlaha: json.spalna_podlaha,
                chalani_vzduch: json.chalani_vzduch,
                chalani_podlaha: json.chalani_podlaha,
                petra_vzduch: json.petra_vzduch,
                petra_podlaha: json.petra_podlaha
            }
        }
    }

    getData() {
        fetch('/api/getLastData/dom', {
            headers: {
                Authorization: `Bearer ${this.auth.getToken()}`,
            }
        }).then(data => {
            if (data.status === 401) {
                console.info('auth 401');
                this.auth.login();
            }
            return data.json();
        }).then(json => {
            this.processData(json);
        }).catch(err => {
            console.error(err);
        });

        fetch('/api/getTrendData/dom', {
            headers: {
                Authorization: `Bearer ${this.auth.getToken()}`,
            }
        }).then(data => {
            if (data.status === 401) {
                console.info('auth 401');
                this.auth.login();
            }
            return data.json();
        }).then(json => {
            this.processTrendData(json);
        }).catch(err => {
            console.error(err);
        });
    }
}  