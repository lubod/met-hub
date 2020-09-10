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
            this.model.stationData = {
                timestamp: new Date(json.timestamp).toLocaleString('sk-SK'),
                time: new Date(json.timestamp).toLocaleTimeString('sk-SK'),
                date: new Date(json.timestamp).toLocaleDateString('sk-SK').replace(' ', ''),
                tempin: parseFloat(json.tempin).toFixed(1),
                humidityin: parseFloat(json.humidityin).toFixed(0),
                temp: parseFloat(json.temp).toFixed(1),
                humidity: parseFloat(json.humidity).toFixed(0),
                pressurerel: parseFloat(json.pressurerel).toFixed(1),
                pressureabs: parseFloat(json.pressureabs).toFixed(1),
                windgust: parseFloat(json.windgust).toFixed(1),
                windspeed: parseFloat(json.windspeed).toFixed(1),
                winddir: parseFloat(json.winddir).toFixed(0),
                maxdailygust: parseFloat(json.maxdailygust).toFixed(1),
                solarradiation: parseFloat(json.solarradiation).toFixed(0),
                uv: parseFloat(json.uv).toFixed(0),
                rainrate: parseFloat(json.rainrate).toFixed(1),
                eventrain: parseFloat(json.eventrain).toFixed(1),
                hourlyrain: parseFloat(json.hourlyrain).toFixed(1),
                dailyrain: parseFloat(json.dailyrain).toFixed(1),
                weeklyrain: parseFloat(json.weeklyrain).toFixed(1),
                monthlyrain: parseFloat(json.monthlyrain).toFixed(1),
                totalrain: parseFloat(json.totalrain).toFixed(1),
                place: 'Marianka'
            };
        });
    }
}  