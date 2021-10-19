import { IStationData, IStationDataRaw, IStationTrendData, StationCfg } from "../common/models/stationModel";
import { IMeasurement } from "./measurement";

const PASSKEY = process.env.STATION_PASSKEY || '';

export class Station implements IMeasurement {
    cfg: StationCfg = new StationCfg();

    getTables() {
        return [this.cfg.TABLE];
    }

    getPasskey() {
        return PASSKEY;
    }

    getSocketChannel() {
        return this.cfg.SOCKET_CHANNEL;
    }

    getSocketTrendChannel() {
        return this.cfg.SOCKET_TREND_CHANNEL;
    }

    getRedisLastDataKey() {
        return this.cfg.REDIS_LAST_DATA_KEY;
    }

    getRedisMinuteDataKey() {
        return this.cfg.REDIS_MINUTE_DATA_KEY;
    }

    getRedisStoreChannel() {
        return this.cfg.REDIS_STORE_CHANNEL;
    }

    getRedisTrendKey() {
        return this.cfg.REDIS_TREND_KEY;
    }

    getQueryArray(table: string, data: IStationData) {
        return [data.timestamp, data.tempin, data.humidityin, data.pressurerel, data.pressureabs, data.temp, data.humidity, data.winddir, data.windspeed, data.windgust, data.rainrate, data.solarradiation, data.uv, data.eventrain, data.hourlyrain];
    }

    getQueryText() {
        return 'insert into ' + this.cfg.TABLE + '(timestamp, tempin, humidityin, pressurerel, pressureabs, temp, humidity, winddir, windspeed, windgust, rainrate, solarradiation, uv, eventrain, hourlyrain) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
    }

    decodeData(data: IStationDataRaw) {
        const TO_MM = 25.4;
        const TO_KM = 1.6;
        const TO_HPA = 33.8639;

        function round(value: number, precision: number) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }

        //    console.log(data)
        const decoded: IStationData = {
            timestamp: new Date(data.dateutc + ' UTC').toISOString(),
            tempin: round((5 / 9) * (data.tempinf - 32), 1),
            pressurerel: round(data.baromrelin * TO_HPA, 1),
            pressureabs: round(data.baromabsin * TO_HPA, 1),
            temp: round((5 / 9) * (data.tempf - 32), 1),
            windspeed: round(data.windspeedmph * TO_KM, 1),
            windgust: round(data.windgustmph * TO_KM, 1),
            maxdailygust: round(data.maxdailygust * TO_KM, 1),
            rainrate: round(data.rainratein * TO_MM, 1),
            eventrain: round(data.eventrainin * TO_MM, 1),
            hourlyrain: round(data.hourlyrainin * TO_MM, 1),
            dailyrain: round(data.dailyrainin * TO_MM, 1),
            weeklyrain: round(data.weeklyrainin * TO_MM, 1),
            monthlyrain: round(data.monthlyrainin * TO_MM, 1),
            totalrain: round(data.totalrainin * TO_MM, 1),
            solarradiation: round(data.solarradiation * 1.0, 0),
            uv: round(data.uv * 1.0, 0),
            humidity: round(data.humidity * 1.0, 0),
            humidityin: round(data.humidityin * 1.0, 0),
            winddir: round(data.winddir * 1.0, 0),
            time: null,
            date: null,
            place: 'Marianka',
        };
        const date = new Date(decoded.timestamp);
        const toStore = decoded;
        return {date, decoded, toStore};
    }

    transformTrendData(data: any) {
        const tmp = {} as IStationTrendData;
        tmp.timestamp = [];
        tmp.tempin = [];
        tmp.humidityin = [];
        tmp.temp = [];
        tmp.humidity = [];
        tmp.pressurerel = [];
        tmp.windgust = [];
        tmp.windspeed = [];
        tmp.winddir = [];
        tmp.solarradiation = [];
        tmp.uv = [];
        tmp.rainrate = [];
        let prev = 0;
        data.forEach((item: any) => {
            let value: IStationData = JSON.parse(item);
            let date = new Date(value.timestamp);
            let time = date.getTime();
            if (time - prev >= 60000) {
                tmp.timestamp.push(value.timestamp);
                tmp.tempin.push(value.tempin);
                tmp.humidityin.push(value.humidityin);
                tmp.temp.push(value.temp);
                tmp.humidity.push(value.humidity);
                tmp.pressurerel.push(value.pressurerel);
                tmp.windgust.push(value.windgust);
                tmp.windspeed.push(value.windspeed);
                tmp.winddir.push(value.winddir);
                tmp.solarradiation.push(value.solarradiation);
                tmp.uv.push(value.uv);
                tmp.rainrate.push(value.rainrate);
                prev = time;
            }
        });
        return tmp;
    }

    agregateMinuteData(data: any) {
        const deg2rad = (degrees: number) => {
            return degrees * (Math.PI / 180);
        }

        const rad2deg = (radians: number) => {
            return radians * (180 / Math.PI);
        }

        const avgWind = (directions: number[]) => {
            let sinSum = 0;
            let cosSum = 0;
            directions.forEach(value => {
                sinSum += Math.sin(deg2rad(value));
                cosSum += Math.cos(deg2rad(value));
            });
            return round((rad2deg(Math.atan2(sinSum, cosSum)) + 360) % 360, 0);
        }

        const round = (value: number, precision: number) => {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }

        const reducer = (sum: IStationData, item: IStationData) => {
            sum.timestamp = item.timestamp;
            sum.tempin += item.tempin;
            sum.humidityin += item.humidityin;
            sum.temp += item.temp;
            sum.humidity += item.humidity;
            sum.pressurerel += item.pressurerel;
            sum.pressureabs += item.pressureabs;
            sum.windgust += item.windgust;
            sum.windspeed += item.windspeed;
            //        sum.winddir += item.winddir;
            sum.solarradiation += item.solarradiation;
            sum.uv += item.uv;
            sum.rainrate += item.rainrate;
            sum.maxdailygust = item.maxdailygust;
            sum.eventrain = item.eventrain;
            sum.hourlyrain = item.hourlyrain;
            sum.dailyrain = item.dailyrain;
            sum.weeklyrain = item.weeklyrain;
            sum.monthlyrain = item.monthlyrain;
            sum.totalrain = item.totalrain;
            sum.place = item.place;
            return sum;
        };

        const average = (sum: IStationData, count: number) => {
            const avg = sum;
            avg.tempin = round(sum.tempin / count, 1);
            avg.temp = round(sum.temp / count, 1);
            avg.pressurerel = round(sum.pressurerel / count, 1);
            avg.pressureabs = round(sum.pressureabs / count, 1);
            avg.windgust = round(sum.windgust / count, 1);
            avg.windspeed = round(sum.windspeed / count, 1);
            avg.rainrate = round(sum.rainrate / count, 1);
            avg.solarradiation = round(sum.solarradiation / count, 0);
            avg.uv = round(sum.uv / count, 0);
            avg.humidityin = round(sum.humidityin / count, 0);
            avg.humidity = round(sum.humidity / count, 0);
            avg.winddir = round(sum.winddir / count, 0);
            return avg;
        };

        const initWithZeros = () => {
            const init: IStationData = {
                tempin: 0,
                temp: 0,
                pressurerel: 0,
                pressureabs: 0,
                windgust: 0,
                windspeed: 0,
                rainrate: 0,
                solarradiation: 0,
                uv: 0,
                humidityin: 0,
                humidity: 0,
                winddir: 0,
                timestamp: null,
                time: null,
                date: null,
                place: null,
                maxdailygust: null,
                eventrain: null,
                hourlyrain: null,
                dailyrain: null,
                weeklyrain: null,
                monthlyrain: null,
                totalrain: null,
            };
            return init;
        };

        const map = new Map();

        data.forEach((item: any) => {
            const sdata: IStationData = JSON.parse(item);
            const sdate = new Date(sdata.timestamp);
            const minute = sdate.getTime() - sdate.getTime() % 60000;
            if (map.has(minute)) {
                const mdata = map.get(minute);
                mdata.push(sdata);
            }
            else {
                const mdata = [sdata];
                map.set(minute, mdata);
            }
        });

        const now = Date.now();

        const result = new Map();

        map.forEach(function (value, key) {
            const minute = new Date(key);
            const date = minute.toISOString();
            console.log(key, date, value);
            const init: IStationData = initWithZeros();
            const sum = value.reduce(reducer, init);
            const avg = average(sum, value.length);
            avg.timestamp = date;
            const windDir: number[] = [];
            value.forEach((element: IStationData) => {
                windDir.push(element.winddir);
            });
            avg.winddir = avgWind(windDir);
            console.info(avg);
            result.set(minute.getTime(), avg);
            console.info('Agregated minute', minute);
        });
        return result;
    }
}

