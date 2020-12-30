import Auth from '../auth';
import Socket from '../socket';
import { StationModel } from '../models/model';

export class StationController {
    constructor(private model: StationModel, private auth: Auth, private socket: Socket) {
        console.info('station ctrl');
        //        this.getData();

        let self = this;
        this.socket.getSocket().on('station', function (json: any) {
            self.processData(json);
        });

        this.socket.getSocket().on('stationTrend', function (json: any) {
            self.processTrendData(json);
        });
    }

    processData(json: any) {
//        console.info(json);
        if (json != null) {
            const sdate = new Date(json.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
            const stime = new Date(json.timestamp).toLocaleTimeString('sk-SK');

            this.model.stationData = {
                timestamp: json.timestamp,
                time: stime,
                date: sdate.substring(0, sdate.length - 6),
                tempin: json.tempin,
                humidityin: json.humidityin,
                temp: json.temp,
                humidity: json.humidity,
                pressurerel: json.pressurerel,
                pressureabs: json.pressureabs,
                windgust: json.windgust,
                windspeed: json.windspeed,
                winddir: json.winddir,
                maxdailygust: json.maxdailygust,
                solarradiation: json.solarradiation,
                uv: json.uv,
                rainrate: json.rainrate,
                eventrain: json.eventrain,
                hourlyrain: json.hourlyrain,
                dailyrain: json.dailyrain,
                weeklyrain: json.weeklyrain,
                monthlyrain: json.monthlyrain,
                totalrain: json.totalrain,
                place: 'Marianka'
            }
        }
    }

    processTrendData(json: any) {
//        console.info(json);
        if (json != null) {
            this.model.stationTrendData = {
                timestamp: json.timestamp,
                tempin: json.tempin,
                humidityin: json.humidityin,
                temp: json.temp,
                humidity: json.humidity,
                pressurerel: json.pressurerel,
                windgust: json.windgust,
                windspeed: json.windspeed,
                winddir: json.winddir,
                solarradiation: json.solarradiation,
                uv: json.uv,
                rainrate: json.rainrate
            }
        }
    }

    getData() {
        fetch('/api/getLastData/station', {
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

        fetch('/api/getTrendData/station', {
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