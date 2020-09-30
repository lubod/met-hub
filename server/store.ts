import { DomData, StationData } from "../client/models/model";
import { Pool } from 'pg';

var redis = require('redis');
var redisClientSub = redis.createClient();
var redisClient = redis.createClient();

async function storeStation(data: StationData) {
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
        client.release();
    }
}

async function storeDom(data: any) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432
    });

    const client = await pool.connect();
    try {
        const now = data.timestamp;
        console.log('connected ' + now);
        await client.query('BEGIN');

        let table = 'vonku';
        let queryText = 'insert into ' + table + '(timestamp, temp, humidity, rain) values ($1, $2, $3, $4)';
        let res = await client.query(queryText, [now, data[table].temp, data[table].humidity, data[table].rain]);
        console.log(data[table].text + ' inserted ' + table);

        table = 'tarif';
        queryText = 'insert into ' + table + '(timestamp, tarif) values ($1, $2)';
        res = await client.query(queryText, [now, data[table].tarif]);
        console.log(data[table].text + ' inserted ' + table);

        for (let table in data) {
            if (table === 'vonku' || table === 'tarif' || table === 'timestamp' || table === 'dateutc') {
                continue;
            }
            if (data[table] !== null) {
                queryText = 'insert into ' + table + '(timestamp, temp, req, reqall, useroffset, maxoffset, kuri, low, leto) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
                res = await client.query(queryText, [now, data[table].temp, data[table].req, data[table].reqall, data[table].useroffset, data[table].maxoffset, data[table].kuri, data[table].low, data[table].leto])
                console.log(data[table].text + ' inserted ' + table);
            }
        }
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

redisClientSub.config('set', 'notify-keyspace-events', 'KEA');

redisClientSub.subscribe('__keyevent@0__:set');

redisClientSub.on('message', function (channel: string, key: string) {
    console.log('msg ' + channel + ' ' + key);

    if (key === 'station') {
        console.log('station');
        redisClient.get(key, function (err: any, reply: any) {
            console.log('err' + err);
            console.log('get ' + reply);
            storeStation(JSON.parse(reply));
        });
    }
    else if (key === 'dom') {
        console.log('dom');
        redisClient.get(key, function (err: any, reply: any) {
            console.log('err' + err);
            console.log('get ' + reply);
            storeDom(JSON.parse(reply));
        });
    }
});
