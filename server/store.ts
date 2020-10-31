import { DomData, StationData } from "../client/models/model";
import { Pool } from 'pg';

var redis = require('redis');
var redisClientSub = redis.createClient();
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

redisClientSub.config('set', 'notify-keyspace-events', 'KEA');

redisClientSub.subscribe('__keyevent@0__:set');

redisClientSub.on('message', function (channel: string, key: string) {
    console.log('msg ' + channel + ' ' + key);

    if (key === 'station') {
        console.log('station');
        redisClient.get(key, function (err: any, reply: any) {
            console.error('err' + err);
            storeStation(JSON.parse(reply));
        });
    }
    else if (key === 'dom') {
        console.log('dom');
        redisClient.get(key, function (err: any, reply: any) {
            console.error('err' + err);
            storeDom(JSON.parse(reply));
        });
    }
});
