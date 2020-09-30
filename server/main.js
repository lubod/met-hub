
const express = require('express');
const bodyParser = require('body-parser');
const pollData = require('./pollData.js');
const app = express();
const redis = require("redis");
const redisClient = redis.createClient();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

let stationTrend = new Map();

function removeOld(value, key, map) {
    const now = Date.now();
    if (now - key > 3600000) {
        map.delete(key);
        console.log('delete ' + key);
    }
    console.log('size ' + map.size);
}

function trend() {
    stationTrend.forEach(removeOld);
    redisClient.get('station', function (err, reply) {
        console.log('err ' + err);
        console.log(reply);
        const last = JSON.parse(reply);
        console.log('trend ' + stationTrend);
        const timestamp = new Date(last.timestamp);
        const now = new Date();
        const diff = now - timestamp;
        console.log('diff ' + diff);
        if (diff < 3600000) {
            stationTrend.set(timestamp.getTime(), last);
            console.log('set ' + timestamp.getTime());
        }

        redisClient.set('stationTrend', 1);
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

/*
{ PASSKEY: '33564A0851CC0C0D15FE3353FB8D8B47',
  stationtype: 'EasyWeatherV1.5.2',
  dateutc: '2020-08-13 06:16:31',
  tempinf: '74.1',
  humidityin: '62',
  baromrelin: '30.189',
  baromabsin: '29.442',
  tempf: '71.4',
  humidity: '72',
  winddir: '69',
  windspeedmph: '0.4',
  windgustmph: '1.1',
  maxdailygust: '3.4',
  rainratein: '0.000',
  eventrainin: '0.000',
  hourlyrainin: '0.000',
  dailyrainin: '0.000',
  weeklyrainin: '0.000',
  monthlyrainin: '0.201',
  totalrainin: '0.201',
  solarradiation: '19.45',
  uv: '0',
  wh65batt: '0',
  freq: '868M',
  model: 'WS2900_V2.01.10' }
*/

const TO_MM = 25.4;
const TO_KM = 1.6;
const TO_HPA = 33.8639;

function decodeStationData(data) {
    data.timestamp = new Date(data.dateutc + ' UTC');
    data.tempin = (5 / 9) * (data.tempinf - 32);
    data.pressurerel = data.baromrelin * TO_HPA;
    data.pressureabs = data.baromabsin * TO_HPA;
    data.temp = (5 / 9) * (data.tempf - 32);
    data.windspeed = data.windspeedmph * TO_KM;
    data.windgust = data.windgustmph * TO_KM;
    data.maxdailygustmph = data.maxdailygust;
    data.maxdailygust = data.maxdailygustmph * TO_KM;
    data.rainrate = data.rainratein * TO_MM;
    data.eventrain = data.eventrainin * TO_MM;
    data.hourlyrain = data.hourlyrainin * TO_MM;
    data.dailyrain = data.dailyrainin * TO_MM;
    data.weeklyrain = data.weeklyrainin * TO_MM;
    data.monthlyrain = data.monthlyrainin * TO_MM;
    data.totalrain = data.totalrainin * TO_MM;
    data.solarradiation = data.solarradiation * 1.0;
    data.uv = data.uv * 1.0;
    data.humidity = data.humidity * 1.0;
    data.humidityin = data.humidityin * 1.0;
    data.winddir = data.winddir * 1.0;
    return data;
}

app.post('/setData', function (req, res) {
    const last = decodeStationData(req.body);
    redisClient.set('station', JSON.stringify(last));
    //    console.log(last);
    res.sendStatus(200);
})

app.get('/', function (req, res) {
    res.sendFile('/home/zaloha/pgclient/dist/index.html');
})

app.get('/:file', function (req, res) {
    res.sendFile('/home/zaloha/pgclient/dist/' + req.params.file);
})

app.get('/getLastData/:uuid', function (req, res) {
    res.type('application/json');
    const last = redisClient.get(req.params.uuid, function (err, reply) {
        return res.json(JSON.parse(reply));
    });
})

app.get('/getTrendData/:uuid', function (req, res) {
    res.type('application/json');
    //    const last = redisClient.get(req.params.uuid, function (err, reply) {
    const tmp = {};
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
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at http://%s:%s", host, port);
})
