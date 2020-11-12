
import express from 'express';
import redis from 'redis';
import { AddressInfo } from 'net';
import { DomTrendData, StationData, StationDataRaw, StationTrendData } from '../client/models/model';
import axios from 'axios';

const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const jwk = JSON.parse(process.env.JWK) || {};
const pem = jwkToPem(jwk.keys[1]);

const app = express();
const redisClient = redis.createClient();

const CLIENT_ID=process.env.CLIENT_ID || '';
const USERNAME=process.env.USERNAME || '';
const STATION_PASSKEY=process.env.STATION_PASSKEY || '';
const DOM_PASSKEY=process.env.DOM_PASSKEY || '';

app.use(express.static(__dirname));
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

function verifyToken(authorization: any) {
    if (authorization) {
        try {
            const decodedToken = jwt.verify(authorization.substr(7), pem, { algorithms: ['RS256'] });
            if (decodedToken.client_id !== CLIENT_ID) {
                console.error('client_id');
                return false;
            }
            if (decodedToken.username !== USERNAME) {
                console.error('username');
//                return false;
            }
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    return false;
}

let stationTrend = new Map();
let domTrend = new Map();

function removeOld(value: any, key: number, map: any) {
    const now = Date.now();
    if (now - key > 3600000) {
        map.delete(key);
    }
}

function trend() {
    stationTrend.forEach(removeOld);
    redisClient.set('stationTrend', JSON.stringify(Array.from(stationTrend.entries())));
    domTrend.forEach(removeOld);
    redisClient.set('domTrend', JSON.stringify(Array.from(domTrend.entries())));
}

setInterval(trend, 60000);

function decodeStationData(data: StationDataRaw) {
    const TO_MM = 25.4;
    const TO_KM = 1.6;
    const TO_HPA = 33.8639;

    function round(value: number, precision: number) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    //    console.log(data);
    let decoded = new StationData();
    decoded.timestamp = new Date(data.dateutc + ' UTC').toISOString();
    decoded.tempin = round((5 / 9) * (data.tempinf - 32), 1);
    decoded.pressurerel = round(data.baromrelin * TO_HPA, 1);
    decoded.pressureabs = round(data.baromabsin * TO_HPA, 1);
    decoded.temp = round((5 / 9) * (data.tempf - 32), 1);
    decoded.windspeed = round(data.windspeedmph * TO_KM, 1);
    decoded.windgust = round(data.windgustmph * TO_KM, 1);
    decoded.maxdailygust = round(data.maxdailygust * TO_KM, 1);
    decoded.rainrate = round(data.rainratein * TO_MM, 1);
    decoded.eventrain = round(data.eventrainin * TO_MM, 1);
    decoded.hourlyrain = round(data.hourlyrainin * TO_MM, 1);
    decoded.dailyrain = round(data.dailyrainin * TO_MM, 1);
    decoded.weeklyrain = round(data.weeklyrainin * TO_MM, 1);
    decoded.monthlyrain = round(data.monthlyrainin * TO_MM, 1);
    decoded.totalrain = round(data.totalrainin * TO_MM, 1);
    decoded.solarradiation = round(data.solarradiation * 1.0, 0);
    decoded.uv = round(data.uv * 1.0, 0);
    decoded.humidity = round(data.humidity * 1.0, 0);
    decoded.humidityin = round(data.humidityin * 1.0, 0);
    decoded.winddir = round(data.winddir * 1.0, 0);
    return decoded;
}

app.post('/setData', function (req: any, res: any) {
    console.info('/setData');
    if (req.body.PASSKEY === STATION_PASSKEY) {
        const last = decodeStationData(req.body);
        const timestamp = new Date(last.timestamp);
        const now = Date.now();
        const diff = now - timestamp.getTime();
        if (diff < 3600000) {
            stationTrend.set(timestamp.getTime(), last);
            redisClient.set('station', JSON.stringify(last));
        }
        try {
            if (!req.body.forward) {
                req.body.forward = true;
                const res = axios.post('https://www.met-hub.com/setData', req.body, {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                });
            }
        } catch (error) {
            console.error(error);
        };
    } else {
        console.error('Wrong PASSKEY' + req.body.PASSKEY);
    }
    res.sendStatus(200);
})

app.post('/setDomData', function (req: any, res: any) {
    console.info('/setDomData');
    if (req.body.PASSKEY === DOM_PASSKEY) {
        const last = req.body;
        const timestamp = new Date(last.timestamp);
        const now = Date.now();
        const diff = now - timestamp.getTime();
        if (diff < 3600000) {
            domTrend.set(timestamp.getTime(), last);
            redisClient.set('dom', JSON.stringify(last));
        }
    } else {
        console.error('Wrong PASSKEY' + req.body.PASSKEY);
    }
    res.sendStatus(200);
})

app.get('/callback', function (req: any, res: any) {
    console.info('/callback');
    res.sendFile('/home/ubuntu/dist/index.html');
})

app.get('/', function (req: any, res: any) {
    console.info('/');
    res.sendFile('/home/ubuntu/dist/index.html');
})

///home/zaloha/pgclient/dist/

app.get('/:file', function (req: any, res: any) {
    console.info('/' + req.params.file);
    res.sendFile('/home/ubuntu/dist/' + req.params.file);
})

app.get('/getLastData/:uuid', function (req: any, res: any) {
    console.info('/getLastData/' + req.params.uuid);
    if (verifyToken(req.headers.authorization) === true) {
        res.type('application/json');
        const last = redisClient.get(req.params.uuid, function (err: any, reply: any) {
            return res.json(JSON.parse(reply));
        });
    }
    else {
        res.status(401).body('auth issue');
    }
})

app.get('/getTrendData/:uuid', function (req: any, res: any) {
    console.info('/getTrendData/' + req.params.uuid);
    if (verifyToken(req.headers.authorization) === true) {
        res.type('application/json');
        //    const last = redisClient.get(req.params.uuid, function (err, reply) {
        if (req.params.uuid === 'station') {
            const tmp = new StationTrendData();
            stationTrend.forEach(function (value, key, map) {
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
            });
            return res.json(tmp);
        }
        else if (req.params.uuid === 'dom') {
            const tmp = new DomTrendData();
            domTrend.forEach(function (value, key, map) {
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
            return res.json(tmp);
        }
        return res.json();
    }
    else {
        res.status(401).body('auth issue');
    }
})

var server = app.listen(8082, function () {
    //    const host = server.address().address;
    const { port } = server.address() as AddressInfo;

    console.log("Listening at http://%s:%s", 'localhost', port);
})
