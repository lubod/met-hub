import { IStationData, IStationDataRaw, IStationTrendData } from "../client/models/stationModel";
import { socketEmitData } from "./main";
import redis from 'redis';
import { verifyToken } from "./utils";

const STATION_PASSKEY = process.env.STATION_PASSKEY || '';

const redisClient = redis.createClient();

export function setStationData(req: any, res: any) {
    console.info('/setData/station');
    if (req.body.PASSKEY === STATION_PASSKEY) {
        const last = decodeStationData(req.body);
        const timestamp = new Date(last.timestamp);
        const now = Date.now();
        const diff = now - timestamp.getTime();
        if (diff < 3600000) {
            socketEmitData('station', last);
            const multi = redisClient.multi();
            multi.set('station', JSON.stringify(last));
            multi.zadd('station-store', timestamp.getTime(), JSON.stringify(last));
            multi.exec(function (err, replies) {
                console.log(replies); // 101, 51
                redisClient.zrangebyscore('station-trend', now - 3600000, now, function (err, result) {
                    socketEmitData('stationTrend', transformStationTrendData(result));
                });
            });
        }
        else {
            console.error('Old data ', timestamp);
        }
    } else {
        console.error('Wrong PASSKEY ', req.body.PASSKEY);
    }
    res.sendStatus(200);
}

export function getStationLastData(req: any, res: any) {
    console.info('/getLastData/station');
    //    if (req.headers.authorization && verifyToken(req.headers.authorization.substr(7)) !== null) {
    res.type('application/json');
    redisClient.get('station', function (err: any, reply: any) {
        return res.json(JSON.parse(reply));
    });
    //    }
    //    else {
    //        res.status(401).send('auth issue');
    //    }
}

export function getStationTrendData(req: any, res: any) {
    console.info('/getDomTrendData/station');
    //    if (req.headers.authorization && verifyToken(req.headers.authorization.substr(7)) !== null) {
    res.type('application/json');
    const now = Date.now();
    redisClient.zrangebyscore('station-trend', now - 3600000, now, function (err, result) {
        return res.json(transformStationTrendData(result));
    });
    //    }
    //    else {
    //        res.status(401).send('auth issue');
    //    }
}

export function decodeStationData(data: IStationDataRaw) {
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
    return decoded;
}

export function transformStationTrendData(data: any) {
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

