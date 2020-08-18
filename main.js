const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const fs = require("fs");

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

var last = {};

async function store(data) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432
    });

    const client = await pool.connect();
    try {
        console.log('connected ' + data.timestamp);
        await client.query('BEGIN');

        let table = 'stanica';
        let queryText = 'insert into ' + table + '(timestamp, tempin, humidityin, pressurerel, pressureabs, temp, humidity, winddir, windspeed, windgust, rainrate, solarradiation, uv, eventrain, hourlyrain) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
        let res = await client.query(queryText, [data.timestamp, data.tempin, data.humidityin, data.pressurerel, data.pressureabs, data.temp, data.humidity, data.winddir, data.windspeed, data.windgust, data.rainrate, data.solarradiation, data.uv, data.eventrain, data.hourlyrain]);
        console.log(data.timestamp + ' inserted ' + table);

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.end();
    }
}

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
    data.tempin = (5/9) * (data.tempinf - 32);
    data.pressurerel = data.baromrelin * TO_HPA;
    data.pressureabs = data.baromabsin * TO_HPA;
    data.temp = (5/9) * (data.tempf - 32);
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
    console.log(req.body);
    last = decodeStationData(req.body);
    store(last);
    res.sendStatus(200);
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
})

app.get('/getLastData', function (req, res) {
    res.type('application/json');
    return res.json(last);
})

app.get('/getData/vonku/:time', function (req, res) {
    res.type('application/json');
    const data = getData('vonku', parseInt(req.params.time)).then(data => res.send(data));
})

app.get('/getData/:room/:time', function (req, res) {
    console.log(req.params.room);
    console.log(req.params.time);
    res.type('application/json');
    const data = getData(req.params.room, parseInt(req.params.time)).then(data => res.send(data));
})

var server = app.listen(8082, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at http://%s:%s", host, port);
})

async function getData(table, time) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432
    });

    const client = await pool.connect();
    console.log('connected ' + table);
    try {
        console.log(time);
        const to = new Date(time).toISOString().slice(0, 19).replace('T', ' ');
        const from = (new Date(time - 86400000)).toISOString().slice(0, 19).replace('T', ' ');
        console.log(from);
        console.log(to);
        const res = await client.query('SELECT * FROM ' + table + ' where timestamp > \'' + from + 'UTC\' and timestamp <= \'' + to + 'UTC\' order by timestamp desc;');
        return res.rows;
    } catch (e) {
        console.log(e);
    } finally {
        client.end();
    }
}

