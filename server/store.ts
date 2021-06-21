import { DomData, StationData } from "../client/models/model";
import { Pool } from 'pg';

var redis = require('redis');
//var redisClientSub = redis.createClient();
var redisClient = redis.createClient();

const PG_PORT = parseInt(process.env.PG_PORT) || 5432;
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres';
const PG_DB = process.env.PG_DB || 'postgres';
const PG_HOST = process.env.PG_HOST || 'localhost';
const PG_USER = process.env.PG_USER || 'postgres';

console.info('PG: ' + PG_HOST);

async function storeStation(data: StationData) {
    const pool = new Pool({
        user: PG_USER,
        host: PG_HOST,
        database: PG_DB,
        password: PG_PASSWORD,
        port: PG_PORT
    });

    const client = await pool.connect();
    try {
        console.info('connected ' + data.timestamp);
        await client.query('BEGIN');

        let table = 'stanica';
        let queryText = 'insert into ' + table + '(timestamp, tempin, humidityin, pressurerel, pressureabs, temp, humidity, winddir, windspeed, windgust, rainrate, solarradiation, uv, eventrain, hourlyrain) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
        let res = await client.query(queryText, [data.timestamp, data.tempin, data.humidityin, data.pressurerel, data.pressureabs, data.temp, data.humidity, data.winddir, data.windspeed, data.windgust, data.rainrate, data.solarradiation, data.uv, data.eventrain, data.hourlyrain]);
        console.info(data.timestamp + ' inserted ' + table);

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
        console.info('released');
    }
}

async function storeDom(data: any) {
    const pool = new Pool({
        user: PG_USER,
        host: PG_HOST,
        database: PG_DB,
        password: PG_PASSWORD,
        port: PG_PORT
    });

    const client = await pool.connect();
    try {
        const now = data.timestamp;
        console.info('connected ' + now);
        await client.query('BEGIN');

        let table = 'vonku';
        let queryText = 'insert into ' + table + '(timestamp, temp, humidity, rain) values ($1, $2, $3, $4)';
        let res = await client.query(queryText, [now, data[table].temp, data[table].humidity, data[table].rain]);
        console.info(data.timestamp + ' inserted ' + table);

        table = 'tarif';
        queryText = 'insert into ' + table + '(timestamp, tarif) values ($1, $2)';
        res = await client.query(queryText, [now, data[table].tarif]);
        console.info(data.timestamp + ' inserted ' + table);

        for (let table in data) {
            if (table === 'vonku' || table === 'tarif' || table === 'timestamp' || table === 'dateutc' || table === 'PASSKEY') {
                continue;
            }
            if (data[table] !== null) {
                queryText = 'insert into ' + table + '(timestamp, temp, req, reqall, useroffset, maxoffset, kuri, low, leto) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
                res = await client.query(queryText, [now, data[table].temp, data[table].req, data[table].reqall, data[table].useroffset, data[table].maxoffset, data[table].kuri, data[table].low, data[table].leto])
                console.info(data.timestamp + ' inserted ' + table);
            }
        }
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
        console.info('released');
    }
}

//redisClientSub.config('set', 'notify-keyspace-events', 'KEA');

//redisClientSub.subscribe('__keyevent@0__:set');

//redisClientSub.on('message', function (channel: string, key: string) {

function agregateAndStoreMinuteData(data: any) {

    const deg2rad = (degrees: number) => {
        return degrees * (Math.PI / 180);
    }

    const rad2deg = (radians: number) => {
        return radians * (180 / Math.PI);
    }

    const avgWind = (directions: number[]) => {
        let sinSum = 0;
        let cosSum = 0;
        directions.forEach(value => {
            sinSum += Math.sin(deg2rad(value));
            cosSum += Math.cos(deg2rad(value));
        });
        return round((rad2deg(Math.atan2(sinSum, cosSum)) + 360) % 360, 0);
    }

    const round = (value: number, precision: number) => {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    const reducer = (sum: StationData, item: StationData) => {
        sum.timestamp = item.timestamp;
        sum.tempin += item.tempin;
        sum.humidityin += item.humidityin;
        sum.temp += item.temp;
        sum.humidity += item.humidity;
        sum.pressurerel += item.pressurerel;
        sum.pressureabs += item.pressureabs;
        sum.windgust += item.windgust;
        sum.windspeed += item.windspeed;
        //        sum.winddir += item.winddir;
        sum.solarradiation += item.solarradiation;
        sum.uv += item.uv;
        sum.rainrate += item.rainrate;
        sum.maxdailygust = item.maxdailygust;
        sum.eventrain = item.eventrain;
        sum.hourlyrain = item.hourlyrain;
        sum.dailyrain = item.dailyrain;
        sum.weeklyrain = item.weeklyrain;
        sum.monthlyrain = item.monthlyrain;
        sum.totalrain = item.totalrain;
        return sum;
    };

    const average = (sum: StationData, count: number) => {
        const avg = sum;
        avg.tempin = round(sum.tempin / count, 1);
        avg.temp = round(sum.temp / count, 1);
        avg.pressurerel = round(sum.pressurerel / count, 1);
        avg.pressureabs = round(sum.pressureabs / count, 1);
        avg.windgust = round(sum.windgust / count, 1);
        avg.windspeed = round(sum.windspeed / count, 1);
        avg.rainrate = round(sum.rainrate / count, 1);
        avg.solarradiation = round(sum.solarradiation / count, 0);
        avg.uv = round(sum.uv / count, 0);
        avg.humidityin = round(sum.humidityin / count, 0);
        avg.humidity = round(sum.humidity / count, 0);
        avg.winddir = round(sum.winddir / count, 0);
        return avg;
    };

    const initWithZeros = () => {
        const init: StationData = {
            tempin: 0,
            temp: 0,
            pressurerel: 0,
            pressureabs: 0,
            windgust: 0,
            windspeed: 0,
            rainrate: 0,
            solarradiation: 0,
            uv: 0,
            humidityin: 0,
            humidity: 0,
            winddir: 0,
            timestamp: null,
            time: null,
            date: null,
            place: null,
            maxdailygust: null,
            eventrain: null,
            hourlyrain: null,
            dailyrain: null,
            weeklyrain: null,
            monthlyrain: null,
            totalrain: null,
        };
        return init;
    };

    const map = new Map();

    data.forEach((item: any) => {
        const sdata: StationData = JSON.parse(item);
        const sdate = new Date(sdata.timestamp);
        const minute = sdate.getTime() - sdate.getTime() % 60000;
        if (map.has(minute)) {
            const mdata = map.get(minute);
            mdata.push(sdata);
        }
        else {
            const mdata = [sdata];
            map.set(minute, mdata);
        }
    });

    const now = Date.now();
    map.forEach(function (value, key) {
        const minute = new Date(key);
        const date = minute.toISOString();
        console.log(key, date, value);
        const init: StationData = initWithZeros();
        const sum = value.reduce(reducer, init);
        const avg = average(sum, value.length);
        avg.timestamp = date;
        const windDir: number[] = [];
        value.forEach((element: StationData) => {
            windDir.push(element.winddir);
        });
        avg.winddir = avgWind(windDir);
        console.info(avg);
        redisClient.zadd('station-trend', minute.getTime(), JSON.stringify(avg));
        redisClient.zremrangebyscore('station-trend', 0, now - 3600000);
        storeStation(avg);
    });
}

const now = Date.now();
console.info('start', now);
const toMinute = now % 60000;

setTimeout(store, 60000 - toMinute);

function store() {
    console.log('store');

    console.log('station-store');
    redisClient.zrangebyscore('station-store', 0, Number.MAX_VALUE, function (err: any, result: any) {
        console.error('err', err);

        agregateAndStoreMinuteData(result);
        redisClient.zremrangebyscore('station-store', 0, Number.MAX_VALUE);
    });

    console.log('dom-store');
    redisClient.zrangebyscore('dom-store', 0, Number.MAX_VALUE, function (err: any, result: any) {
        console.error('err', err);

        result.forEach((item: any) => {
            storeDom(JSON.parse(item));
        });

        redisClient.zremrangebyscore('dom-store', 0, Number.MAX_VALUE);
    });

    const now = Date.now();
    const toMinute = now % 60000;
    setTimeout(store, 60000 - toMinute);
}
