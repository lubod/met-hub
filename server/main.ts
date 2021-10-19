
import express from 'express';
import redis from 'redis';
import { AddressInfo } from 'net';
import router from './router';
import { verifyToken } from './utils';
import { Station } from './station';
import { Dom } from './dom';
import { IMeasurement } from './measurement';

const proxy = require('express-http-proxy');
const app = express();
const redisClient = redis.createClient();
const redisPub = redis.createClient();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const sockets: any[] = [];
const station = new Station();
const dom = new Dom();

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
            return verifyToken(req.query.token) !== null;
        }

        const urlParams = new URLSearchParams(req.headers.referer);
        const token = urlParams.get('token')
        return verifyToken(token) !== null;
    }
}));

app.use(router);

export function socketEmitData(channel: string, data: any) {
    sockets.forEach(socket => {
        socket.emit(channel, data);
        console.log('emit', channel)
    });
}

io.on('connection', function (socket: any) {
    console.log('a user connected', socket.id);

    socket.on('disconnect', function () {
        const index = sockets.indexOf(socket);
        if (index > -1) {
            sockets.splice(index, 1);
        }
        console.log('A user disconnected', socket.id);
        console.info('sockets', sockets.length);
    });

    sockets.push(socket);

    console.info('sockets', sockets.length);
});

function agregateMinuteData(measurement: IMeasurement, data: any) {
    const map = measurement.agregateMinuteData(data);
    const multi = redisClient.multi();
    const msg: any[] = [];
    const now = Date.now();

    map.forEach(function (avg: any, minute: string | number) {
        multi.zadd(measurement.getRedisTrendKey(), minute, JSON.stringify(avg));
        msg.push(avg);
    });
    multi.zremrangebyscore(measurement.getRedisTrendKey(), 0, now - 3600000);
    multi.exec(function (err, replies) {
        console.log(replies); // 101, 51
    });
    redisPub.publish(measurement.getRedisStoreChannel(), JSON.stringify(msg));
    redisClient.zrangebyscore(measurement.getRedisTrendKey(), now - 3600000, now, function (err, result) {
        socketEmitData(measurement.getSocketTrendChannel(), measurement.transformTrendData(result));
    });
}

function agregator() {
    console.log(station.getRedisMinuteDataKey());
    redisClient.zrangebyscore(station.getRedisMinuteDataKey(), 0, Number.MAX_VALUE, function (err: any, result: any) {
        if (result.length > 0) {
            agregateMinuteData(station, result);
            redisClient.zremrangebyscore(station.getRedisMinuteDataKey(), 0, Number.MAX_VALUE);
        }
    });

    console.log(dom.getRedisMinuteDataKey());
    redisClient.zrangebyscore(dom.getRedisMinuteDataKey(), 0, Number.MAX_VALUE, function (err: any, result: any) {
        if (result.length > 0) {
            //console.info(result);
            try {
                agregateMinuteData(dom, JSON.parse(result));
            } catch (e) {
                console.error(e, result);
            }
            finally {
                redisClient.zremrangebyscore(dom.getRedisMinuteDataKey(), 0, Number.MAX_VALUE);
            }
        }
    });

    const now = Date.now();
    const toMinute = now % 60000;
    setTimeout(agregator, 60000 - toMinute);
}

console.info('start agregator');
const toMinute = Date.now() % 60000;
setTimeout(agregator, 60000 - toMinute);

var server = http.listen(8082, function () {
    //    const host = server.address().address;
    const { port } = server.address() as AddressInfo;

    console.log("Listening at http://%s:%s", 'localhost', port);
})

