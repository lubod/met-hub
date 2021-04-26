import redis from 'redis';
import { DomTrendData } from '../client/models/model';
import { socketEmitData } from './main';
import { verifyToken } from "./utils";

const redisClient = redis.createClient();

const DOM_PASSKEY = process.env.DOM_PASSKEY || '';

export function setDomData(req: any, res: any) {
    console.info('/setDomData');
    if (req.body.PASSKEY === DOM_PASSKEY) {
        const last = req.body;
        const timestamp = new Date(last.timestamp);
        const now = Date.now();
        const diff = now - timestamp.getTime();
        if (diff < 3600000) {
            socketEmitData('dom', last);
            const multi = redisClient.multi();
            multi.set('dom', JSON.stringify(last));
            multi.zadd('dom-store', timestamp.getTime(), JSON.stringify(last));
            multi.zadd('dom-os', timestamp.getTime(), JSON.stringify(last));
            multi.zremrangebyscore('dom-os', 0, now - 3600000);
            multi.exec(function (err, replies) {
                console.log(replies); // 101, 51
                redisClient.zrangebyscore('dom-os', now - 3600000, now, function (err, result) {
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
    if (req.headers.authorization && verifyToken(req.headers.authorization.substr(7)) !== null) {
        res.type('application/json');
        redisClient.get('dom', function (err: any, reply: any) {
            return res.json(JSON.parse(reply));
        });
    }
    else {
        res.status(401).send('auth issue');
    }
}

export function getDomTrendData(req: any, res: any) {
    console.info('/getDomTrendData/dom');
    if (req.headers.authorization && verifyToken(req.headers.authorization.substr(7)) !== null) {
        res.type('application/json');
        const now = Date.now();
        redisClient.zrangebyscore('dom-os', now - 3600000, now, function (err, result) {
            return res.json(transformDomTrendData(result));
        });
    }
    else {
        res.status(401).send('auth issue');
    }
}

export function transformDomTrendData(data: any) {
    const tmp = new DomTrendData();
    data.forEach((item: any) => {
        let value = JSON.parse(item);
        tmp.timestamp.push(value.timestamp);
        tmp.temp.push(value.vonku.temp);
        tmp.humidity.push(value.vonku.humidity);
        tmp.rain.push(value.vonku.rain);
        tmp.obyvacka_vzduch.push(value.obyvacka_vzduch.temp);
        tmp.obyvacka_podlaha.push(value.obyvacka_podlaha.temp);
        tmp.pracovna_vzduch.push(value.pracovna_vzduch.temp);
        tmp.pracovna_podlaha.push(value.pracovna_podlaha.temp);
        tmp.spalna_vzduch.push(value.spalna_vzduch.temp);
        tmp.spalna_podlaha.push(value.spalna_podlaha.temp);
        tmp.chalani_vzduch.push(value.chalani_vzduch.temp);
        tmp.chalani_podlaha.push(value.chalani_podlaha.temp);
        tmp.petra_vzduch.push(value.petra_vzduch.temp);
        tmp.petra_podlaha.push(value.petra_podlaha.temp);
    });
    return tmp;
}

