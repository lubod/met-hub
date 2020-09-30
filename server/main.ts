
import express from 'express';
import bodyParser from 'body-parser';
import pollData from './pollData';
import redis from 'redis';
import { AddressInfo } from 'net';
import { StationData, StationDataRaw, StationTrendData } from '../client/models/model';


const app = express();
const redisClient = redis.createClient();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

let stationTrend = new Map();

function removeOld(value: any, key: number, map: any) {
    const now = Date.now();
    if (now - key > 3600000) {
        map.delete(key);
        console.log('delete ' + key);
    }
    console.log('size ' + map.size);
}

function trend() {
    stationTrend.forEach(removeOld);
    redisClient.get('station', function (err: any, reply: any) {
        console.log('err ' + err);
        console.log(reply);
        const last = JSON.parse(reply);
        console.log('trend ' + stationTrend);
        const timestamp = new Date(last.timestamp);
        const now = Date.now();
        const diff = now - timestamp.getTime();
        console.log('diff ' + diff);
        if (diff < 3600000) {
            stationTrend.set(timestamp.getTime(), last);
            console.log('set ' + timestamp.getTime());
        }

        redisClient.set('stationTrend', '1');
    });
}

setInterval(trend, 60000);

async function poll() {
    const data = await pollData.pollData();
    //    console.log(data);
    redisClient.set('dom', JSON.stringify(data));
}

poll();
setInterval(poll, 60000);

function decodeStationData(data: StationDataRaw) {
    const TO_MM = 25.4;
    const TO_KM = 1.6;
    const TO_HPA = 33.8639;

    function round(value: number, precision: number) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    console.log(data);
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
    const last = decodeStationData(req.body);
    redisClient.set('station', JSON.stringify(last));
    //    console.log(last);
    res.sendStatus(200);
})

app.get('/', function (req: any, res: any) {
    res.sendFile('/home/zaloha/pgclient/dist/index.html');
})

app.get('/:file', function (req: any, res: any) {
    res.sendFile('/home/zaloha/pgclient/dist/' + req.params.file);
})

app.get('/getLastData/:uuid', function (req: any, res: any) {
    res.type('application/json');
    const last = redisClient.get(req.params.uuid, function (err: any, reply: any) {
        return res.json(JSON.parse(reply));
    });
})

app.get('/getTrendData/:uuid', function (req: any, res: any) {
    res.type('application/json');
    //    const last = redisClient.get(req.params.uuid, function (err, reply) {
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
})

var server = app.listen(8082, function () {
    //    const host = server.address().address;
    const { port } = server.address() as AddressInfo;

    console.log("Listening at http://%s:%s", 'localhost', port);
})
