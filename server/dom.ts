import redis from 'redis';
import { IDomTrendData, IDomData, IDomDataRaw } from '../client/models/domModel';
import { socketEmitData } from './main';
import { verifyToken } from "./utils";

const redisClient = redis.createClient();

const DOM_PASSKEY = process.env.DOM_PASSKEY || '';

export function setDomData(req: any, res: any) {
    console.info('/setDomData');
    if (req.body.PASSKEY === DOM_PASSKEY) {
        const last = decodeDomData(req.body);
        //console.info(last);
        const timestamp = new Date(last.timestamp);
        const now = Date.now();
        const diff = now - timestamp.getTime();
        if (diff < 3600000) {
            socketEmitData('dom', last);
            const multi = redisClient.multi();
            multi.set('dom', JSON.stringify(last));
            multi.zadd('dom-store', timestamp.getTime(), JSON.stringify(req.body));
            multi.zadd('dom-trend', timestamp.getTime(), JSON.stringify(last));
            multi.zremrangebyscore('dom-trend', 0, now - 3600000);
            multi.exec(function (err, replies) {
                console.log(replies); // 101, 51
                redisClient.zrangebyscore('dom-trend', now - 3600000, now, function (err, result) {
                    socketEmitData('domTrend', transformDomTrendData(result));
                });
            });
        }
    } else {
        console.error('Wrong PASSKEY' + req.body.PASSKEY);
    }
    res.sendStatus(200);
}

export function getDomLastData(req: any, res: any) {
    console.info('/getLastData/dom');
//    if (req.headers.authorization && verifyToken(req.headers.authorization.substr(7)) !== null) {
        res.type('application/json');
        redisClient.get('dom', function (err: any, reply: any) {
            return res.json(JSON.parse(reply));
        });
//    }
//    else {
//        res.status(401).send('auth issue');
//    }
}

export function getDomTrendData(req: any, res: any) {
    console.info('/getDomTrendData/dom');
//    if (req.headers.authorization && verifyToken(req.headers.authorization.substr(7)) !== null) {
        res.type('application/json');
        const now = Date.now();
        redisClient.zrangebyscore('dom-trend', now - 3600000, now, function (err, result) {
            return res.json(transformDomTrendData(result));
        });
//    }
//    else {
//        res.status(401).send('auth issue');
//    }
}

export function decodeDomData(data: IDomDataRaw) {
    //    console.log(data)
    const decoded: IDomData = {
        timestamp: data.timestamp,
        temp: data.vonku.temp,
        humidity: data.vonku.humidity,
        rain: data.vonku.rain,
        obyvacka_vzduch: data.obyvacka_vzduch.temp,
        obyvacka_podlaha: data.obyvacka_podlaha.temp,
        obyvacka_req: data.obyvacka_vzduch.req,
        obyvacka_kuri: data.obyvacka_podlaha.kuri,
        obyvacka_leto: data.obyvacka_podlaha.leto,
        obyvacka_low: data.obyvacka_podlaha.low,
        pracovna_vzduch: data.pracovna_vzduch.temp,
        pracovna_podlaha: data.pracovna_podlaha.temp,
        pracovna_req: data.pracovna_vzduch.req,
        pracovna_kuri: data.pracovna_podlaha.kuri,
        pracovna_leto: data.pracovna_podlaha.leto,
        pracovna_low: data.pracovna_podlaha.low,
        spalna_vzduch: data.spalna_vzduch.temp,
        spalna_podlaha: data.spalna_podlaha.temp,
        spalna_req: data.spalna_vzduch.req,
        spalna_kuri: data.spalna_podlaha.kuri,
        spalna_leto: data.spalna_podlaha.leto,
        spalna_low: data.spalna_podlaha.low,
        chalani_vzduch: data.chalani_vzduch.temp,
        chalani_podlaha: data.chalani_podlaha.temp,
        chalani_req: data.chalani_vzduch.req,
        chalani_kuri: data.chalani_podlaha.kuri,
        chalani_leto: data.chalani_podlaha.leto,
        chalani_low: data.chalani_podlaha.low,
        petra_vzduch: data.petra_vzduch.temp,
        petra_podlaha: data.petra_podlaha.temp,
        petra_req: data.petra_vzduch.req,
        petra_kuri: data.petra_podlaha.kuri,
        petra_leto: data.petra_podlaha.leto,
        petra_low: data.petra_podlaha.low,
        time: null,
        date: null,
        place: 'Dom',
    };
    return decoded;
}

export function transformDomTrendData(data: any) {
    //console.info('transformDomTrendData', data);
    const tmp = {} as IDomTrendData;
    tmp.timestamp = [];
    tmp.temp = [];
    tmp.humidity = [];
    tmp.rain = [];
    tmp.obyvacka_vzduch = [];
    tmp.obyvacka_podlaha = [];
    tmp.pracovna_vzduch = [];
    tmp.pracovna_podlaha = [];
    tmp.spalna_vzduch = [];
    tmp.spalna_podlaha = [];
    tmp.chalani_vzduch = [];
    tmp.chalani_podlaha = [];
    tmp.petra_vzduch = [];
    tmp.petra_podlaha = [];

    data.forEach((item: any) => {
        let value: IDomData = JSON.parse(item);
        tmp.timestamp.push(value.timestamp);
        tmp.temp.push(value.temp);
        tmp.humidity.push(value.humidity);
        tmp.rain.push(value.rain);
        tmp.obyvacka_vzduch.push(value.obyvacka_vzduch);
        tmp.obyvacka_podlaha.push(value.obyvacka_podlaha);
        tmp.pracovna_vzduch.push(value.pracovna_vzduch);
        tmp.pracovna_podlaha.push(value.pracovna_podlaha);
        tmp.spalna_vzduch.push(value.spalna_vzduch);
        tmp.spalna_podlaha.push(value.spalna_podlaha);
        tmp.chalani_vzduch.push(value.chalani_vzduch);
        tmp.chalani_podlaha.push(value.chalani_podlaha);
        tmp.petra_vzduch.push(value.petra_vzduch);
        tmp.petra_podlaha.push(value.petra_podlaha);
    });
    return tmp;
}

