import { IDomTrendData, IDomData, IDomDataRaw, DomCfg } from '../common/models/domModel';
import { IMeasurement } from './measurement';

const OBYVACKA_VZDUCH = 'obyvacka_vzduch';
const OBYVACKA_PODLAHA = 'obyvacka_podlaha';
const PRACOVNA_VZDUCH = 'pracovna_vzduch';
const PRACOVNA_PODLAHA = 'pracovna_podlaha';
const SPALNA_VZDUCH = 'spalna_vzduch';
const SPALNA_PODLAHA = 'spalna_podlaha';
const CHALANI_VZDUCH = 'chalani_vzduch';
const CHALANI_PODLAHA = 'chalani_podlaha';
const PETRA_VZDUCH = 'petra_vzduch';
const PETRA_PODLAHA = 'petra_podlaha';
const ZADVERIE_VZDUCH = 'zadverie_vzduch';
const ZADVERIE_PODLAHA = 'zadverie_podlaha';
const CHODBA_VZDUCH = 'chodba_vzduch';
const CHODBA_PODLAHA = 'chodba_podlaha';
const SATNA_VZDUCH = 'satna_vzduch';
const SATNA_PODLAHA = 'satna_podlaha';
const KUPELNA_HORE = 'kupelna_hore';
const KUPELNA_DOLE = 'kupelna_dole';
const VONKU = 'vonku';
const TARIF = 'tarif';

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
            case OBYVACKA_VZDUCH:
                return [data.timestamp, data[OBYVACKA_VZDUCH].temp, data[OBYVACKA_VZDUCH].req, data[OBYVACKA_VZDUCH].reqall, data[OBYVACKA_VZDUCH].useroffset, data[OBYVACKA_VZDUCH].maxoffset, data[OBYVACKA_VZDUCH].kuri, data[OBYVACKA_VZDUCH].low, data[OBYVACKA_VZDUCH].leto];
            case OBYVACKA_PODLAHA:
                return [data.timestamp, data[OBYVACKA_PODLAHA].temp, data[OBYVACKA_PODLAHA].req, data[OBYVACKA_PODLAHA].reqall, data[OBYVACKA_PODLAHA].useroffset, data[OBYVACKA_PODLAHA].maxoffset, data[OBYVACKA_PODLAHA].kuri, data[OBYVACKA_PODLAHA].low, data[OBYVACKA_PODLAHA].leto];
            case PRACOVNA_VZDUCH:
                return [data.timestamp, data[PRACOVNA_VZDUCH].temp, data[PRACOVNA_VZDUCH].req, data[PRACOVNA_VZDUCH].reqall, data[PRACOVNA_VZDUCH].useroffset, data[PRACOVNA_VZDUCH].maxoffset, data[PRACOVNA_VZDUCH].kuri, data[PRACOVNA_VZDUCH].low, data[PRACOVNA_VZDUCH].leto];
            case PRACOVNA_PODLAHA:
                return [data.timestamp, data[PRACOVNA_PODLAHA].temp, data[PRACOVNA_PODLAHA].req, data[PRACOVNA_PODLAHA].reqall, data[PRACOVNA_PODLAHA].useroffset, data[PRACOVNA_PODLAHA].maxoffset, data[PRACOVNA_PODLAHA].kuri, data[PRACOVNA_PODLAHA].low, data[PRACOVNA_PODLAHA].leto];
            case SPALNA_VZDUCH:
                return [data.timestamp, data[SPALNA_VZDUCH].temp, data[SPALNA_VZDUCH].req, data[SPALNA_VZDUCH].reqall, data[SPALNA_VZDUCH].useroffset, data[SPALNA_VZDUCH].maxoffset, data[SPALNA_VZDUCH].kuri, data[SPALNA_VZDUCH].low, data[SPALNA_VZDUCH].leto];
            case SPALNA_PODLAHA:
                return [data.timestamp, data[SPALNA_PODLAHA].temp, data[SPALNA_PODLAHA].req, data[SPALNA_PODLAHA].reqall, data[SPALNA_PODLAHA].useroffset, data[SPALNA_PODLAHA].maxoffset, data[SPALNA_PODLAHA].kuri, data[SPALNA_PODLAHA].low, data[SPALNA_PODLAHA].leto];
            case CHALANI_VZDUCH:
                return [data.timestamp, data[CHALANI_VZDUCH].temp, data[CHALANI_VZDUCH].req, data[CHALANI_VZDUCH].reqall, data[CHALANI_VZDUCH].useroffset, data[CHALANI_VZDUCH].maxoffset, data[CHALANI_VZDUCH].kuri, data[CHALANI_VZDUCH].low, data[CHALANI_VZDUCH].leto];
            case CHALANI_PODLAHA:
                return [data.timestamp, data[CHALANI_PODLAHA].temp, data[CHALANI_PODLAHA].req, data[CHALANI_PODLAHA].reqall, data[CHALANI_PODLAHA].useroffset, data[CHALANI_PODLAHA].maxoffset, data[CHALANI_PODLAHA].kuri, data[CHALANI_PODLAHA].low, data[CHALANI_PODLAHA].leto];
            case PETRA_VZDUCH:
                return [data.timestamp, data[PETRA_VZDUCH].temp, data[PETRA_VZDUCH].req, data[PETRA_VZDUCH].reqall, data[PETRA_VZDUCH].useroffset, data[PETRA_VZDUCH].maxoffset, data[PETRA_VZDUCH].kuri, data[PETRA_VZDUCH].low, data[PETRA_VZDUCH].leto];
            case PETRA_PODLAHA:
                return [data.timestamp, data[PETRA_PODLAHA].temp, data[PETRA_PODLAHA].req, data[PETRA_PODLAHA].reqall, data[PETRA_PODLAHA].useroffset, data[PETRA_PODLAHA].maxoffset, data[PETRA_PODLAHA].kuri, data[PETRA_PODLAHA].low, data[PETRA_PODLAHA].leto];
            case ZADVERIE_VZDUCH:
                return [data.timestamp, data[ZADVERIE_VZDUCH].temp, data[ZADVERIE_VZDUCH].req, data[ZADVERIE_VZDUCH].reqall, data[ZADVERIE_VZDUCH].useroffset, data[ZADVERIE_VZDUCH].maxoffset, data[ZADVERIE_VZDUCH].kuri, data[ZADVERIE_VZDUCH].low, data[ZADVERIE_VZDUCH].leto];
            case ZADVERIE_PODLAHA:
                return [data.timestamp, data[ZADVERIE_PODLAHA].temp, data[ZADVERIE_PODLAHA].req, data[ZADVERIE_PODLAHA].reqall, data[ZADVERIE_PODLAHA].useroffset, data[ZADVERIE_PODLAHA].maxoffset, data[ZADVERIE_PODLAHA].kuri, data[ZADVERIE_PODLAHA].low, data[ZADVERIE_PODLAHA].leto];
            case CHODBA_VZDUCH:
                return [data.timestamp, data[CHODBA_VZDUCH].temp, data[CHODBA_VZDUCH].req, data[CHODBA_VZDUCH].reqall, data[CHODBA_VZDUCH].useroffset, data[CHODBA_VZDUCH].maxoffset, data[CHODBA_VZDUCH].kuri, data[CHODBA_VZDUCH].low, data[CHODBA_VZDUCH].leto];
            case CHODBA_PODLAHA:
                return [data.timestamp, data[CHODBA_PODLAHA].temp, data[CHODBA_PODLAHA].req, data[CHODBA_PODLAHA].reqall, data[CHODBA_PODLAHA].useroffset, data[CHODBA_PODLAHA].maxoffset, data[CHODBA_PODLAHA].kuri, data[CHODBA_PODLAHA].low, data[CHODBA_PODLAHA].leto];
            case SATNA_VZDUCH:
                return [data.timestamp, data[SATNA_VZDUCH].temp, data[SATNA_VZDUCH].req, data[SATNA_VZDUCH].reqall, data[SATNA_VZDUCH].useroffset, data[SATNA_VZDUCH].maxoffset, data[SATNA_VZDUCH].kuri, data[SATNA_VZDUCH].low, data[SATNA_VZDUCH].leto];
            case SATNA_PODLAHA:
                return [data.timestamp, data[SATNA_PODLAHA].temp, data[SATNA_PODLAHA].req, data[SATNA_PODLAHA].reqall, data[SATNA_PODLAHA].useroffset, data[SATNA_PODLAHA].maxoffset, data[SATNA_PODLAHA].kuri, data[SATNA_PODLAHA].low, data[SATNA_PODLAHA].leto];
            case KUPELNA_HORE:
                return [data.timestamp, data[KUPELNA_HORE].temp, data[KUPELNA_HORE].req, data[KUPELNA_HORE].reqall, data[KUPELNA_HORE].useroffset, data[KUPELNA_HORE].maxoffset, data[KUPELNA_HORE].kuri, data[KUPELNA_HORE].low, data[KUPELNA_HORE].leto];
            case KUPELNA_DOLE:
                return [data.timestamp, data[KUPELNA_DOLE].temp, data[KUPELNA_DOLE].req, data[KUPELNA_DOLE].reqall, data[KUPELNA_DOLE].useroffset, data[KUPELNA_DOLE].maxoffset, data[KUPELNA_DOLE].kuri, data[KUPELNA_DOLE].low, data[KUPELNA_DOLE].leto];
            case VONKU:
                return [data.timestamp, data[VONKU].temp, data[VONKU].humidity, data[VONKU].rain];
            case TARIF:
                return [data.timestamp, data[TARIF].tarif];
        }
    }

    getQueryText(table: string) {
        switch (table) {
            case OBYVACKA_VZDUCH:
            case OBYVACKA_PODLAHA:
            case PRACOVNA_VZDUCH:
            case PRACOVNA_PODLAHA:
            case SPALNA_VZDUCH:
            case SPALNA_PODLAHA:
            case CHALANI_VZDUCH:
            case CHALANI_PODLAHA:
            case PETRA_VZDUCH:
            case PETRA_PODLAHA:
            case ZADVERIE_VZDUCH:
            case ZADVERIE_PODLAHA:
            case CHODBA_VZDUCH:
            case CHODBA_PODLAHA:
            case SATNA_VZDUCH:
            case SATNA_PODLAHA:
            case KUPELNA_HORE:
            case KUPELNA_DOLE:
                return 'insert into ' + table + '(timestamp, temp, req, reqall, useroffset, maxoffset, kuri, low, leto) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
            case VONKU:
                return 'insert into ' + table + '(timestamp, temp, humidity, rain) values ($1, $2, $3, $4)';
            case TARIF: 'insert into ' + table + '(timestamp, tarif) values ($1, $2)';

        }
    }

    getTables() {
        return [
            OBYVACKA_VZDUCH,
            OBYVACKA_PODLAHA,
            PRACOVNA_VZDUCH,
            PRACOVNA_PODLAHA,
            SPALNA_VZDUCH,
            SPALNA_PODLAHA,
            CHALANI_VZDUCH,
            CHALANI_PODLAHA,
            PETRA_VZDUCH,
            PETRA_PODLAHA,
            ZADVERIE_VZDUCH,
            ZADVERIE_PODLAHA,
            CHODBA_VZDUCH,
            CHODBA_PODLAHA,
            SATNA_VZDUCH,
            SATNA_PODLAHA,
            KUPELNA_HORE,
            KUPELNA_DOLE,
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
            let value: IDomData = JSON.parse(item);
            tmp.timestamp.push(value.timestamp);
            tmp.temp.push(value.temp);
            tmp.humidity.push(value.humidity);
            tmp.rain.push(value.rain);
            tmp.obyvacka_vzduch.push(value.obyvacka_vzduch);
            tmp.obyvacka_podlaha.push(value.obyvacka_podlaha);
            tmp.pracovna_vzduch.push(value.pracovna_vzduch);
            tmp.pracovna_podlaha.push(value.pracovna_podlaha);
            tmp.spalna_vzduch.push(value.spalna_vzduch);
            tmp.spalna_podlaha.push(value.spalna_podlaha);
            tmp.chalani_vzduch.push(value.chalani_vzduch);
            tmp.chalani_podlaha.push(value.chalani_podlaha);
            tmp.petra_vzduch.push(value.petra_vzduch);
            tmp.petra_podlaha.push(value.petra_podlaha);
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
        map.set(new Date().getTime(), data);
        console.info(data);
        return map;
    }
}





