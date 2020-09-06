const fetch = require("node-fetch");
const { exec } = require("child_process");
const { Pool } = require('pg')

const redis = require("redis");
const redisClient = redis.createClient();

const POS_ACTUALTEMP = 14,
    POS_REQUIRED = 19,
    POS_REQUIREDALL = 22,
    POS_USEROFFSET = 27,
    POS_MAXOFFSET = 32,
    POS_S_TOPI = 36,
    POS_S_OKNO = 37,
    POS_S_KARTA = 38,
    POS_VALIDATE = 39,
    POS_LOW = 42,
    POS_LETO = 43,
    POS_S_CHLADI = 44;

const tables = {
    10: 'obyvacka_vzduch',
    0: 'obyvacka_podlaha',
    11: 'zadverie_vzduch',
    1: 'zadverie_podlaha',
    12: 'pracovna_vzduch',
    2: 'pracovna_podlaha',
    13: 'chodba_vzduch',
    3: 'chodba_podlaha',
    14: 'satna_vzduch',
    4: 'satna_podlaha',
    15: 'petra_vzduch',
    5: 'petra_podlaha',
    16: 'chalani_vzduch',
    6: 'chalani_podlaha',
    17: 'spalna_vzduch',
    7: 'spalna_podlaha',
    8: 'kupelna_dole',
    9: 'kupelna_hore'
    //    18: 'tarif',
    //    19: 'vonku',
    //    20: 'vonku',
};

const request = {
    'credentials': 'omit',
    'headers': {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0',
        'Accept': 'text/plain, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'max-age=0'
    },
    'referrer': 'http://192.168.1.113/h_inforoom.html',
    'method': 'POST',
    'mode': 'cors'
}

function login() {
    return fetch('http://192.168.1.113/menu.html', {
        'credentials': 'omit',
        'headers': {
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Upgrade-Insecure-Requests': '1'
        },
        'referrer': 'http://192.168.1.113/login.html?btnRelogin=Znovu+p%C5%99ihl%C3%A1sit',
        'body': 'loginName=admin&passwd=1234',
        'method': 'POST',
        'mode': 'cors'
    });
}

function getTarif() {
    request.body = 'param+';
    return fetch("http://192.168.1.113/loadHDO", request)
        .then(res => res.text());
}

function getCount() {
    request.body = 'param+';
    return fetch('http://192.168.1.113/numOfRooms', request)
        .then(res => res.text());
}

function getData(param) {
    request.body = 'param=' + param;
    return fetch('http://192.168.1.113/wholeRoom', request)
        .then(res => res.text());
}


function getExternalData() {
    return fetch("http://192.168.1.5/getTH", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
            "If-None-Match": "W/\"1b-gSBrGQ+usH2f39nYMJVnOGR8ATM\"",
            "Cache-Control": "max-age=0"
        },
        "method": "GET",
        "mode": "cors"
    }).then(res => res.text());
}

function decode(text) {
    const data = {};
    if (text.length === 45) {
        data.temp = parseFloat(text.substr(POS_ACTUALTEMP, 5));
        data.req = parseFloat(text.substr(POS_REQUIRED, 3));
        data.reqall = parseFloat(text.substr(POS_REQUIREDALL, 5));
        data.useroffset = parseFloat(text.substr(POS_USEROFFSET, 5));
        data.maxoffset = parseFloat(text.substr(POS_MAXOFFSET, 4));
        data.kuri = parseInt(text.substr(POS_S_TOPI, 1));
        data.low = parseInt(text.substr(POS_LOW, 1));
        data.leto = parseInt(text.substr(POS_LETO, 1));
        data.text = text;
        return data;
    }
    return null;
}

function decodeTarif(text) {
    const data = {};
    if (text.length === 1) {
        data.tarif = parseInt(text);
        data.text = text;
        return data;
    }
    return null;
}

function decodeExternal(text) {
    const data = {};
    if (text !== '') {
        const th = text.match(/Temp=(.*)\*  Humidity=(.*)%\nRain=(.*\n)/);
        data.temp = parseFloat(th[1]);
        data.humidity = parseFloat(th[2]);
        data.rain = parseInt(th[3]);
        data.text = text;
    }
    return data;
}

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

        for (let i in tables) {
            let table = tables[i];
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
        client.end();
    }
}

async function storeData() {
    const data = {};

    console.log('storeData');
    let res = await login();
    //    console.log(res);
    const count = await getCount();
    //    console.log(count);
    for (let i = 0; i < count; i++) {
        const res = await getData(i);
        const decoded = decode(res);
        data[tables[i]] = decoded;
    }

    res = await getExternalData();
    data['vonku'] = decodeExternal(res);

    res = await getTarif();
    //    console.log(res);
    data['tarif'] = decodeTarif(res);
    //    console.log(data['tarif']);
    data.timestamp = new Date();
    data.dateutc = `${data.timestamp.getUTCFullYear()}-${data.timestamp.getUTCMonth() + 1}-${data.timestamp.getUTCDate()} ${data.timestamp.getUTCHours()}:${data.timestamp.getUTCMinutes()}:${data.timestamp.getUTCSeconds()}`;
    console.log(data);
    redisClient.set('dom', JSON.stringify(data));
    await store(data);
}

module.exports = { storeData }

