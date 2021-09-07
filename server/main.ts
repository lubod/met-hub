
import express from 'express';
import redis from 'redis';
import { AddressInfo } from 'net';
import router from './router';
import { verifyToken } from './utils';
import { transformStationTrendData } from './station';
import { transformDomTrendData } from './dom';

let proxy = require('express-http-proxy');
const app = express();
const redisClient = redis.createClient();

let http = require('http').Server(app);
let io = require('socket.io')(http);

let sockets: any[] = [];

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
    });
}

io.on('connection', function (socket: any) {
    function emitLastestStationData() {
        const now = Date.now();
        redisClient.get('station', function (err: any, reply: any) {
            socket.emit('station', JSON.parse(reply));
            redisClient.zrangebyscore('station-trend', now - 3600000, now, function (err, result) {
                socket.emit('stationTrend', transformStationTrendData(result));
            });
        });
    }

    console.log('a user connected', socket.id);

    socket.on('station', function (message: any) {
        console.info('station', message, 'emit latest data', socket.id);
        emitLastestStationData();
    });

    socket.on('disconnect', function () {
        const index = sockets.indexOf(socket);
        if (index > -1) {
            sockets.splice(index, 1);
        }
        console.log('A user disconnected', socket.id);
        console.info('sockets', sockets.length);
    });

    console.info('emit latest dom data');
    sockets.push(socket);

    const now = Date.now();
    redisClient.get('dom', function (err: any, reply: any) {
        socket.emit('dom', JSON.parse(reply));
        redisClient.zrangebyscore('dom-trend', now - 3600000, now, function (err, result) {
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

