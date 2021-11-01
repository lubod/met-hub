import { IDomTrendData, IDomData, IDomDataRaw, DomCfg } from '../common/models/domModel';
import { IMeasurement } from './measurement';
const cloneDeep = require('lodash.clonedeep');

export enum TABLES {
    OBYVACKA_VZDUCH = 'obyvacka_vzduch',
    OBYVACKA_PODLAHA = 'obyvacka_podlaha',
    PRACOVNA_VZDUCH = 'pracovna_vzduch',
    PRACOVNA_PODLAHA = 'pracovna_podlaha',
    SPALNA_VZDUCH = 'spalna_vzduch',
    SPALNA_PODLAHA = 'spalna_podlaha',
    CHALANI_VZDUCH = 'chalani_vzduch',
    CHALANI_PODLAHA = 'chalani_podlaha',
    PETRA_VZDUCH = 'petra_vzduch',
    PETRA_PODLAHA = 'petra_podlaha',
    ZADVERIE_VZDUCH = 'zadverie_vzduch',
    ZADVERIE_PODLAHA = 'zadverie_podlaha',
    CHODBA_VZDUCH = 'chodba_vzduch',
    CHODBA_PODLAHA = 'chodba_podlaha',
    SATNA_VZDUCH = 'satna_vzduch',
    SATNA_PODLAHA = 'satna_podlaha',
    KUPELNA_HORE = 'kupelna_hore',
    KUPELNA_DOLE = 'kupelna_dole',
    VONKU = 'vonku',
    TARIF = 'tarif',
}

const PASSKEY = process.env.DOM_PASSKEY || '';

export class Dom implements IMeasurement {
    cfg: DomCfg = new DomCfg();

    getPasskey() {
        return PASSKEY;
    }

    getSocketChannel() {
        return this.cfg.SOCKET_CHANNEL;
    }

    getSocketTrendChannel() {
        return this.cfg.SOCKET_TREND_CHANNEL;
    }

    getRedisLastDataKey() {
        return this.cfg.REDIS_LAST_DATA_KEY;
    }

    getRedisMinuteDataKey() {
        return this.cfg.REDIS_MINUTE_DATA_KEY;
    }

    getRedisStoreChannel() {
        return this.cfg.REDIS_STORE_CHANNEL;
    }

    getRedisTrendKey() {
        return this.cfg.REDIS_TREND_KEY;
    }

    getQueryArray(table: string, data: IDomDataRaw) {
        switch (table) {
            case TABLES.OBYVACKA_VZDUCH:
                return [data.timestamp, data[TABLES.OBYVACKA_VZDUCH].temp, data[TABLES.OBYVACKA_VZDUCH].req, data[TABLES.OBYVACKA_VZDUCH].reqall, data[TABLES.OBYVACKA_VZDUCH].useroffset, data[TABLES.OBYVACKA_VZDUCH].maxoffset, data[TABLES.OBYVACKA_VZDUCH].kuri, data[TABLES.OBYVACKA_VZDUCH].low, data[TABLES.OBYVACKA_VZDUCH].leto];
            case TABLES.OBYVACKA_PODLAHA:
                return [data.timestamp, data[TABLES.OBYVACKA_PODLAHA].temp, data[TABLES.OBYVACKA_PODLAHA].req, data[TABLES.OBYVACKA_PODLAHA].reqall, data[TABLES.OBYVACKA_PODLAHA].useroffset, data[TABLES.OBYVACKA_PODLAHA].maxoffset, data[TABLES.OBYVACKA_PODLAHA].kuri, data[TABLES.OBYVACKA_PODLAHA].low, data[TABLES.OBYVACKA_PODLAHA].leto];
            case TABLES.PRACOVNA_VZDUCH:
                return [data.timestamp, data[TABLES.PRACOVNA_VZDUCH].temp, data[TABLES.PRACOVNA_VZDUCH].req, data[TABLES.PRACOVNA_VZDUCH].reqall, data[TABLES.PRACOVNA_VZDUCH].useroffset, data[TABLES.PRACOVNA_VZDUCH].maxoffset, data[TABLES.PRACOVNA_VZDUCH].kuri, data[TABLES.PRACOVNA_VZDUCH].low, data[TABLES.PRACOVNA_VZDUCH].leto];
            case TABLES.PRACOVNA_PODLAHA:
                return [data.timestamp, data[TABLES.PRACOVNA_PODLAHA].temp, data[TABLES.PRACOVNA_PODLAHA].req, data[TABLES.PRACOVNA_PODLAHA].reqall, data[TABLES.PRACOVNA_PODLAHA].useroffset, data[TABLES.PRACOVNA_PODLAHA].maxoffset, data[TABLES.PRACOVNA_PODLAHA].kuri, data[TABLES.PRACOVNA_PODLAHA].low, data[TABLES.PRACOVNA_PODLAHA].leto];
            case TABLES.SPALNA_VZDUCH:
                return [data.timestamp, data[TABLES.SPALNA_VZDUCH].temp, data[TABLES.SPALNA_VZDUCH].req, data[TABLES.SPALNA_VZDUCH].reqall, data[TABLES.SPALNA_VZDUCH].useroffset, data[TABLES.SPALNA_VZDUCH].maxoffset, data[TABLES.SPALNA_VZDUCH].kuri, data[TABLES.SPALNA_VZDUCH].low, data[TABLES.SPALNA_VZDUCH].leto];
            case TABLES.SPALNA_PODLAHA:
                return [data.timestamp, data[TABLES.SPALNA_PODLAHA].temp, data[TABLES.SPALNA_PODLAHA].req, data[TABLES.SPALNA_PODLAHA].reqall, data[TABLES.SPALNA_PODLAHA].useroffset, data[TABLES.SPALNA_PODLAHA].maxoffset, data[TABLES.SPALNA_PODLAHA].kuri, data[TABLES.SPALNA_PODLAHA].low, data[TABLES.SPALNA_PODLAHA].leto];
            case TABLES.CHALANI_VZDUCH:
                return [data.timestamp, data[TABLES.CHALANI_VZDUCH].temp, data[TABLES.CHALANI_VZDUCH].req, data[TABLES.CHALANI_VZDUCH].reqall, data[TABLES.CHALANI_VZDUCH].useroffset, data[TABLES.CHALANI_VZDUCH].maxoffset, data[TABLES.CHALANI_VZDUCH].kuri, data[TABLES.CHALANI_VZDUCH].low, data[TABLES.CHALANI_VZDUCH].leto];
            case TABLES.CHALANI_PODLAHA:
                return [data.timestamp, data[TABLES.CHALANI_PODLAHA].temp, data[TABLES.CHALANI_PODLAHA].req, data[TABLES.CHALANI_PODLAHA].reqall, data[TABLES.CHALANI_PODLAHA].useroffset, data[TABLES.CHALANI_PODLAHA].maxoffset, data[TABLES.CHALANI_PODLAHA].kuri, data[TABLES.CHALANI_PODLAHA].low, data[TABLES.CHALANI_PODLAHA].leto];
            case TABLES.PETRA_VZDUCH:
                return [data.timestamp, data[TABLES.PETRA_VZDUCH].temp, data[TABLES.PETRA_VZDUCH].req, data[TABLES.PETRA_VZDUCH].reqall, data[TABLES.PETRA_VZDUCH].useroffset, data[TABLES.PETRA_VZDUCH].maxoffset, data[TABLES.PETRA_VZDUCH].kuri, data[TABLES.PETRA_VZDUCH].low, data[TABLES.PETRA_VZDUCH].leto];
            case TABLES.PETRA_PODLAHA:
                return [data.timestamp, data[TABLES.PETRA_PODLAHA].temp, data[TABLES.PETRA_PODLAHA].req, data[TABLES.PETRA_PODLAHA].reqall, data[TABLES.PETRA_PODLAHA].useroffset, data[TABLES.PETRA_PODLAHA].maxoffset, data[TABLES.PETRA_PODLAHA].kuri, data[TABLES.PETRA_PODLAHA].low, data[TABLES.PETRA_PODLAHA].leto];
            case TABLES.ZADVERIE_VZDUCH:
                return [data.timestamp, data[TABLES.ZADVERIE_VZDUCH].temp, data[TABLES.ZADVERIE_VZDUCH].req, data[TABLES.ZADVERIE_VZDUCH].reqall, data[TABLES.ZADVERIE_VZDUCH].useroffset, data[TABLES.ZADVERIE_VZDUCH].maxoffset, data[TABLES.ZADVERIE_VZDUCH].kuri, data[TABLES.ZADVERIE_VZDUCH].low, data[TABLES.ZADVERIE_VZDUCH].leto];
            case TABLES.ZADVERIE_PODLAHA:
                return [data.timestamp, data[TABLES.ZADVERIE_PODLAHA].temp, data[TABLES.ZADVERIE_PODLAHA].req, data[TABLES.ZADVERIE_PODLAHA].reqall, data[TABLES.ZADVERIE_PODLAHA].useroffset, data[TABLES.ZADVERIE_PODLAHA].maxoffset, data[TABLES.ZADVERIE_PODLAHA].kuri, data[TABLES.ZADVERIE_PODLAHA].low, data[TABLES.ZADVERIE_PODLAHA].leto];
            case TABLES.CHODBA_VZDUCH:
                return [data.timestamp, data[TABLES.CHODBA_VZDUCH].temp, data[TABLES.CHODBA_VZDUCH].req, data[TABLES.CHODBA_VZDUCH].reqall, data[TABLES.CHODBA_VZDUCH].useroffset, data[TABLES.CHODBA_VZDUCH].maxoffset, data[TABLES.CHODBA_VZDUCH].kuri, data[TABLES.CHODBA_VZDUCH].low, data[TABLES.CHODBA_VZDUCH].leto];
            case TABLES.CHODBA_PODLAHA:
                return [data.timestamp, data[TABLES.CHODBA_PODLAHA].temp, data[TABLES.CHODBA_PODLAHA].req, data[TABLES.CHODBA_PODLAHA].reqall, data[TABLES.CHODBA_PODLAHA].useroffset, data[TABLES.CHODBA_PODLAHA].maxoffset, data[TABLES.CHODBA_PODLAHA].kuri, data[TABLES.CHODBA_PODLAHA].low, data[TABLES.CHODBA_PODLAHA].leto];
            case TABLES.SATNA_VZDUCH:
                return [data.timestamp, data[TABLES.SATNA_VZDUCH].temp, data[TABLES.SATNA_VZDUCH].req, data[TABLES.SATNA_VZDUCH].reqall, data[TABLES.SATNA_VZDUCH].useroffset, data[TABLES.SATNA_VZDUCH].maxoffset, data[TABLES.SATNA_VZDUCH].kuri, data[TABLES.SATNA_VZDUCH].low, data[TABLES.SATNA_VZDUCH].leto];
            case TABLES.SATNA_PODLAHA:
                return [data.timestamp, data[TABLES.SATNA_PODLAHA].temp, data[TABLES.SATNA_PODLAHA].req, data[TABLES.SATNA_PODLAHA].reqall, data[TABLES.SATNA_PODLAHA].useroffset, data[TABLES.SATNA_PODLAHA].maxoffset, data[TABLES.SATNA_PODLAHA].kuri, data[TABLES.SATNA_PODLAHA].low, data[TABLES.SATNA_PODLAHA].leto];
            case TABLES.KUPELNA_HORE:
                return [data.timestamp, data[TABLES.KUPELNA_HORE].temp, data[TABLES.KUPELNA_HORE].req, data[TABLES.KUPELNA_HORE].reqall, data[TABLES.KUPELNA_HORE].useroffset, data[TABLES.KUPELNA_HORE].maxoffset, data[TABLES.KUPELNA_HORE].kuri, data[TABLES.KUPELNA_HORE].low, data[TABLES.KUPELNA_HORE].leto];
            case TABLES.KUPELNA_DOLE:
                return [data.timestamp, data[TABLES.KUPELNA_DOLE].temp, data[TABLES.KUPELNA_DOLE].req, data[TABLES.KUPELNA_DOLE].reqall, data[TABLES.KUPELNA_DOLE].useroffset, data[TABLES.KUPELNA_DOLE].maxoffset, data[TABLES.KUPELNA_DOLE].kuri, data[TABLES.KUPELNA_DOLE].low, data[TABLES.KUPELNA_DOLE].leto];
            case TABLES.VONKU:
                return [data.timestamp, data[TABLES.VONKU].temp, data[TABLES.VONKU].humidity, data[TABLES.VONKU].rain];
            case TABLES.TARIF:
                return [data.timestamp, data[TABLES.TARIF].tarif];
        }
    }

    getQueryText(table: string) {
        switch (table) {
            case TABLES.OBYVACKA_VZDUCH:
            case TABLES.OBYVACKA_PODLAHA:
            case TABLES.PRACOVNA_VZDUCH:
            case TABLES.PRACOVNA_PODLAHA:
            case TABLES.SPALNA_VZDUCH:
            case TABLES.SPALNA_PODLAHA:
            case TABLES.CHALANI_VZDUCH:
            case TABLES.CHALANI_PODLAHA:
            case TABLES.PETRA_VZDUCH:
            case TABLES.PETRA_PODLAHA:
            case TABLES.ZADVERIE_VZDUCH:
            case TABLES.ZADVERIE_PODLAHA:
            case TABLES.CHODBA_VZDUCH:
            case TABLES.CHODBA_PODLAHA:
            case TABLES.SATNA_VZDUCH:
            case TABLES.SATNA_PODLAHA:
            case TABLES.KUPELNA_HORE:
            case TABLES.KUPELNA_DOLE:
                return 'insert into ' + table + '(timestamp, temp, req, reqall, useroffset, maxoffset, kuri, low, leto) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
            case TABLES.VONKU:
                return 'insert into ' + table + '(timestamp, temp, humidity, rain) values ($1, $2, $3, $4)';
            case TABLES.TARIF:
                return 'insert into ' + table + '(timestamp, tarif) values ($1, $2)';

        }
    }

    getTables() {
        return [
            TABLES.OBYVACKA_VZDUCH,
            TABLES.OBYVACKA_PODLAHA,
            TABLES.PRACOVNA_VZDUCH,
            TABLES.PRACOVNA_PODLAHA,
            TABLES.SPALNA_VZDUCH,
            TABLES.SPALNA_PODLAHA,
            TABLES.CHALANI_VZDUCH,
            TABLES.CHALANI_PODLAHA,
            TABLES.PETRA_VZDUCH,
            TABLES.PETRA_PODLAHA,
            TABLES.ZADVERIE_VZDUCH,
            TABLES.ZADVERIE_PODLAHA,
            TABLES.CHODBA_VZDUCH,
            TABLES.CHODBA_PODLAHA,
            TABLES.SATNA_VZDUCH,
            TABLES.SATNA_PODLAHA,
            TABLES.KUPELNA_HORE,
            TABLES.KUPELNA_DOLE,
            TABLES.VONKU,
            TABLES.TARIF
        ];
    }

    transformTrendData(data: any) {
        //console.info('transformDomTrendData', data);
        const tmp = {} as IDomTrendData;
        tmp.timestamp = [];
        tmp.temp = [];
        tmp.humidity = [];
        tmp.rain = [];
        tmp.obyvacka_vzduch = [];
        tmp.obyvacka_podlaha = [];
        tmp.pracovna_vzduch = [];
        tmp.pracovna_podlaha = [];
        tmp.spalna_vzduch = [];
        tmp.spalna_podlaha = [];
        tmp.chalani_vzduch = [];
        tmp.chalani_podlaha = [];
        tmp.petra_vzduch = [];
        tmp.petra_podlaha = [];

        data.forEach((item: any) => {
            let value: IDomDataRaw = JSON.parse(item);
            tmp.timestamp.push(value.timestamp);
            tmp.temp.push(value.vonku.temp);
            tmp.humidity.push(value.vonku.humidity);
            tmp.rain.push(value.vonku.rain);
            tmp.obyvacka_vzduch.push(value.obyvacka_vzduch.temp);
            tmp.obyvacka_podlaha.push(value.obyvacka_podlaha.temp);
            tmp.pracovna_vzduch.push(value.pracovna_vzduch.temp);
            tmp.pracovna_podlaha.push(value.pracovna_podlaha.temp);
            tmp.spalna_vzduch.push(value.spalna_vzduch.temp);
            tmp.spalna_podlaha.push(value.spalna_podlaha.temp);
            tmp.chalani_vzduch.push(value.chalani_vzduch.temp);
            tmp.chalani_podlaha.push(value.chalani_podlaha.temp);
            tmp.petra_vzduch.push(value.petra_vzduch.temp);
            tmp.petra_podlaha.push(value.petra_podlaha.temp);
        });
        return tmp;
    }

    decodeData(data: IDomDataRaw) {
        //    console.log(data)
        const decoded: IDomData = {
            timestamp: data.timestamp,
            temp: data.vonku.temp,
            humidity: data.vonku.humidity,
            rain: data.vonku.rain,
            obyvacka_vzduch: data.obyvacka_vzduch.temp,
            obyvacka_podlaha: data.obyvacka_podlaha.temp,
            obyvacka_req: data.obyvacka_vzduch.req,
            obyvacka_kuri: data.obyvacka_podlaha.kuri,
            obyvacka_leto: data.obyvacka_podlaha.leto,
            obyvacka_low: data.obyvacka_podlaha.low,
            pracovna_vzduch: data.pracovna_vzduch.temp,
            pracovna_podlaha: data.pracovna_podlaha.temp,
            pracovna_req: data.pracovna_vzduch.req,
            pracovna_kuri: data.pracovna_podlaha.kuri,
            pracovna_leto: data.pracovna_podlaha.leto,
            pracovna_low: data.pracovna_podlaha.low,
            spalna_vzduch: data.spalna_vzduch.temp,
            spalna_podlaha: data.spalna_podlaha.temp,
            spalna_req: data.spalna_vzduch.req,
            spalna_kuri: data.spalna_podlaha.kuri,
            spalna_leto: data.spalna_podlaha.leto,
            spalna_low: data.spalna_podlaha.low,
            chalani_vzduch: data.chalani_vzduch.temp,
            chalani_podlaha: data.chalani_podlaha.temp,
            chalani_req: data.chalani_vzduch.req,
            chalani_kuri: data.chalani_podlaha.kuri,
            chalani_leto: data.chalani_podlaha.leto,
            chalani_low: data.chalani_podlaha.low,
            petra_vzduch: data.petra_vzduch.temp,
            petra_podlaha: data.petra_podlaha.temp,
            petra_req: data.petra_vzduch.req,
            petra_kuri: data.petra_podlaha.kuri,
            petra_leto: data.petra_podlaha.leto,
            petra_low: data.petra_podlaha.low,
            time: null,
            date: null,
            place: 'Dom',
        };
        const date = new Date(decoded.timestamp);
        const toStore = data;
        return { date, decoded, toStore };
    }

    agregateMinuteData(data: any) {
        const map = new Map();
        const deepCopy = cloneDeep(JSON.parse(data));
        const date = new Date(deepCopy.timestamp);
        date.setUTCSeconds(0);
        deepCopy.timestamp = date.toISOString();
        map.set(date.getTime(), deepCopy);
        console.info('Agregated dom minute', deepCopy.timestamp);
        return map;
    }
}





