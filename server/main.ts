
import express from 'express';
import redis from 'redis';
import { AddressInfo } from 'net';
import { DomTrendData, StationData, StationDataRaw, StationTrendData } from '../client/models/model';
import axios from 'axios';

let proxy = require('express-http-proxy');

const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const jwk = JSON.parse(process.env.JWK) || {};
const pem = jwkToPem(jwk.keys[1]);

const app = express();
const redisClient = redis.createClient();

const CLIENT_ID = process.env.CLIENT_ID || '';
const USERNAME = process.env.USERNAME || '';
const STATION_PASSKEY = process.env.STATION_PASSKEY || '';
const DOM_PASSKEY = process.env.DOM_PASSKEY || '';

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

let sockets: any[] = [];

function socketEmitData(channel: string, data: any) {
    sockets.forEach(socket => {
        socket.emit(channel, data);
    });
}

app.use(express.static(__dirname));
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());
app.use('/charts', proxy('localhost:3000/charts', {
    filter: function (req: any, res: any) {
        if (req.query.token) {
            return verifyToken(req.query.token) === true;
        }

        const urlParams = new URLSearchParams(req.headers.referer);
        const token = urlParams.get('token')
        return verifyToken(token) === true;
    }
}));

function verifyToken(token: any) {
    if (token) {
        try {
            const decodedToken = jwt.verify(token, pem, { algorithms: ['RS256'] });
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
            socketEmitData('station', last);
            redisClient.set('station', JSON.stringify(last));
            redisClient.zadd('station-os', timestamp.getTime(), JSON.stringify(last));
            redisClient.zremrangebyscore('station-os', 0, now - 3600000);
            redisClient.zrangebyscore('station-os', now - 3600000, now, function (err, result) {
                socketEmitData('stationTrend', transformStationTrendData(result));
            });
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
            socketEmitData('dom', last);
            redisClient.set('dom', JSON.stringify(last));
            redisClient.zadd('dom-os', timestamp.getTime(), JSON.stringify(last));
            redisClient.zremrangebyscore('dom-os', 0, now - 3600000);
            redisClient.zrangebyscore('dom-os', now - 3600000, now, function (err, result) {
                socketEmitData('domTrend', transformDomTrendData(result));
            });
        }
    } else {
        console.error('Wrong PASSKEY' + req.body.PASSKEY);
    }
    res.sendStatus(200);
})

app.get('/api/getLastData/:uuid', function (req: any, res: any) {
    console.info('/getLastData/' + req.params.uuid);
    if (req.headers.authorization && verifyToken(req.headers.authorization.substr(7)) === true) {
        res.type('application/json');
        const last = redisClient.get(req.params.uuid, function (err: any, reply: any) {
            return res.json(JSON.parse(reply));
        });
    }
    else {
        res.status(401).send('auth issue');
    }
})

function transformStationTrendData(data: any) {
    const tmp = new StationTrendData();
    data.forEach((item: any) => {
        let value = JSON.parse(item);
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
    return tmp;
}

function transformDomTrendData(data: any) {
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

app.get('/api/getTrendData/:uuid', function (req: any, res: any) {
    console.info('/getTrendData/' + req.params.uuid);
    if (req.headers.authorization && verifyToken(req.headers.authorization.substr(7)) === true) {
        res.type('application/json');
        //    const last = redisClient.get(req.params.uuid, function (err, reply) {
        if (req.params.uuid === 'station') {
            //            return res.json(transformStationTrendData());
        }
        else if (req.params.uuid === 'dom') {
            //            return res.json(transformDomTrendData());
        }
        return res.json();
    }
    else {
        res.status(401).send('auth issue');
    }
})

io.on('connection', function (socket: any) {
    console.log('a user connected', socket.id);

    socket.on('message', function (message: any) {
        console.log(message);
    });

    socket.on('disconnect', function () {
        const index = sockets.indexOf(socket);
        if (index > -1) {
            sockets.splice(index, 1);
        }
        console.log('A user disconnected', socket.id);
    });

    console.info('emit latest data');
    socket.emit('message', 'WELCOME');
    sockets.push(socket);
    const now = Date.now();
    redisClient.get('station', function (err: any, reply: any) {
        socket.emit('station', JSON.parse(reply));
        redisClient.zrangebyscore('station-os', now - 3600000, now, function (err, result) {
            socket.emit('stationTrend', transformStationTrendData(result));
        });
    });
    redisClient.get('dom', function (err: any, reply: any) {
        socket.emit('dom', JSON.parse(reply));
        redisClient.zrangebyscore('dom-os', now - 3600000, now, function (err, result) {
            socket.emit('domTrend', transformDomTrendData(result));
        });
    });

    console.info('sockets', sockets.length);
});

var server = http.listen(8082, function () {
    //    const host = server.address().address;
    const { port } = server.address() as AddressInfo;

    console.log("Listening at http://%s:%s", 'localhost', port);
})
