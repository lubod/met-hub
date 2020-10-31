import { StationModel } from '../models/model';

export class StationController {

    constructor(private model: StationModel) {
        this.getData();

        setInterval(() => {
            this.getData();
        }, 5000);
    }

    getData() {
        fetch('/getLastData/station').then(data => data.json()).then(json => {
            if (json != null) {
                this.model.stationData = {
                    timestamp: json.timestamp,
                    time: new Date(json.timestamp).toLocaleTimeString('sk-SK'),
                    date: new Date(json.timestamp).toLocaleDateString('sk-SK').replace(' ', ''),
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
            };
        });
        fetch('/getTrendData/station').then(data => data.json()).then(json => {
            if (json != null) {
                this.model.stationTrendData.timestamp = json.timestamp;
                this.model.stationTrendData.tempin = json.tempin;
                this.model.stationTrendData.humidityin = json.humidityin;
                this.model.stationTrendData.temp = json.temp;
                this.model.stationTrendData.humidity = json.humidity;
                this.model.stationTrendData.pressurerel = json.pressurerel;
                this.model.stationTrendData.windgust = json.windgust;
                this.model.stationTrendData.windspeed = json.windspeed;
                this.model.stationTrendData.winddir = json.winddir;
                this.model.stationTrendData.solarradiation = json.solarradiation;
                this.model.stationTrendData.uv = json.uv;
                this.model.stationTrendData.rainrate = json.rainrate;
            }
        });
    }
}  