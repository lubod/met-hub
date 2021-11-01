
import express from 'express';
import { AddressInfo } from 'net';
import router from './router';
import { verifyToken } from './utils';
import { SocketEmitter } from './socketEmitter';
import { Agregator } from './agregator';

const proxy = require('express-http-proxy');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketEmiter = new SocketEmitter();
const agregator = new Agregator(socketEmiter);
agregator.start();

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

io.on('connection', function (socket: any) {
    console.log('a user connected', socket.id);
    socketEmiter.addSocket(socket);

    socket.on('disconnect', function () {
        socketEmiter.removeSocket(socket);
        console.log('A user disconnected', socket.id);
    });
});

export function socketEmitData(channel: string, data: any) {
    socketEmiter.emit(channel, data);
}

var server = http.listen(8082, function () {
    //    const host = server.address().address;
    const { port } = server.address() as AddressInfo;

    console.log("Listening at http://%s:%s", 'localhost', port);
})

