import { IDomData, IDomDataRaw, IDomRoomData } from "../common/models/domModel";
import { IStationData } from "../common/models/stationModel";
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

async function storeStation(data: IStationData) {
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

async function storeDom(data: IDomDataRaw) {
    const pool = new Pool({
        user: PG_USER,
        host: PG_HOST,
        database: PG_DB,
        password: PG_PASSWORD,
        port: PG_PORT
    });

    async function storeRoomData(table: string, data: IDomRoomData, timestamp: string) {
        const queryText = 'insert into ' + table + '(timestamp, temp, req, reqall, useroffset, maxoffset, kuri, low, leto) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
        const res = await client.query(queryText, [timestamp, data.temp, data.req, data.reqall, data.useroffset, data.maxoffset, data.kuri, data.low, data.leto])
        console.info(timestamp + ' inserted ' + table);
        return res;
    }

    const client = await pool.connect();
    try {
        const timestamp = data.timestamp;
        console.info('connected ' + timestamp);
        await client.query('BEGIN');

        let table = 'vonku';
        let queryText = 'insert into ' + table + '(timestamp, temp, humidity, rain) values ($1, $2, $3, $4)';
        let res = await client.query(queryText, [timestamp, data.vonku.temp, data.vonku.humidity, data.vonku.rain]);
        console.info(data.timestamp + ' inserted ' + table);

        table = 'tarif';
        queryText = 'insert into ' + table + '(timestamp, tarif) values ($1, $2)';
        res = await client.query(queryText, [timestamp, data.tarif.tarif]);
        console.info(data.timestamp + ' inserted ' + table);

        res = await storeRoomData('obyvacka_vzduch', data.obyvacka_vzduch, timestamp);
        res = await storeRoomData('obyvacka_podlaha', data.obyvacka_podlaha, timestamp);
        res = await storeRoomData('pracovna_vzduch', data.pracovna_vzduch, timestamp);
        res = await storeRoomData('pracovna_podlaha', data.pracovna_podlaha, timestamp);
        res = await storeRoomData('spalna_vzduch', data.spalna_vzduch, timestamp);
        res = await storeRoomData('spalna_podlaha', data.spalna_podlaha, timestamp);
        res = await storeRoomData('chalani_vzduch', data.chalani_vzduch, timestamp);
        res = await storeRoomData('chalani_podlaha', data.chalani_podlaha, timestamp);
        res = await storeRoomData('petra_vzduch', data.petra_vzduch, timestamp);
        res = await storeRoomData('petra_podlaha', data.petra_podlaha, timestamp);
        res = await storeRoomData('zadverie_vzduch', data.zadverie_vzduch, timestamp);
        res = await storeRoomData('zadverie_podlaha', data.zadverie_podlaha, timestamp);
        res = await storeRoomData('chodba_vzduch', data.chodba_vzduch, timestamp);
        res = await storeRoomData('chodba_podlaha', data.chodba_podlaha, timestamp);
        res = await storeRoomData('satna_vzduch', data.satna_vzduch, timestamp);
        res = await storeRoomData('satna_podlaha', data.satna_podlaha, timestamp);
        res = await storeRoomData('kupelna_hore', data.kupelna_hore, timestamp);
        res = await storeRoomData('kupelna_dole', data.kupelna_dole, timestamp);

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

    const reducer = (sum: IStationData, item: IStationData) => {
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

    const average = (sum: IStationData, count: number) => {
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
        const init: IStationData = {
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
        const sdata: IStationData = JSON.parse(item);
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
        const init: IStationData = initWithZeros();
        const sum = value.reduce(reducer, init);
        const avg = average(sum, value.length);
        avg.timestamp = date;
        const windDir: number[] = [];
        value.forEach((element: IStationData) => {
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
    console.log('station-store');
    redisClient.zrangebyscore('station-store', 0, Number.MAX_VALUE, function (err: any, result: any) {
        agregateAndStoreMinuteData(result);
        redisClient.zremrangebyscore('station-store', 0, Number.MAX_VALUE);
    });

    console.log('dom-store');
    redisClient.zrangebyscore('dom-store', 0, Number.MAX_VALUE, function (err: any, result: any) {
        result.forEach((item: any) => {
            storeDom(JSON.parse(item));
        });
        redisClient.zremrangebyscore('dom-store', 0, Number.MAX_VALUE);
    });

    const now = Date.now();
    const toMinute = now % 60000;
    setTimeout(store, 60000 - toMinute);
}
