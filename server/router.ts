import express from 'express';
import { Station } from './station';
import { verifyToken } from './utils';
import redis from 'redis';
import { socketEmitData } from './main';
import { Dom } from './dom';
import { IMeasurement } from './measurement';

const station = new Station();
const dom = new Dom();
const router = express.Router();
const redisClient = redis.createClient();

router.post('/setData', setStationData);
router.get('/api/getLastData/station', getStationLastData);
router.get('/api/getTrendData/station', getStationTrendData);

router.post('/setDomData', setDomData);
router.get('/api/getLastData/dom', getDomLastData);
router.get('/api/getTrendData/dom', getDomTrendData);

router.get('/api/getUserProfile', function (req: any, res: any) {
    console.info('/getUserProfile');
    if (req.headers.authorization) {
        const user = verifyToken(req.headers.authorization.substr(7));
        if (user !== null) {
            res.type('application/json');
            return res.json(user);
        }
        else {
            res.status(401).send('auth issue');
        }
    }
    else {
        res.status(401).send('auth issue');
    }
})

function setStationData(req: any, res: any) {
    console.info('/setData/station');
    setData(station, req, res);
}

function setDomData(req: any, res: any) {
    console.info('/setData/dom');
    setData(dom, req, res);
}

function setData(measurement: IMeasurement, req: any, res: any) {
    if (req.body.PASSKEY === measurement.getPasskey()) {
        //console.info(req.body);
        const { date, decoded, toStore } = measurement.decodeData(req.body);
        const now = Date.now();
        const diff = now - date.getTime();
        if (diff < 3600000) {
            socketEmitData(measurement.getSocketChannel(), decoded);
            const multi = redisClient.multi();
            multi.set(measurement.getRedisLastDataKey(), JSON.stringify(decoded));
            multi.zadd(measurement.getRedisMinuteDataKey(), date.getTime(), JSON.stringify(toStore));
            multi.exec(function (err, replies) {
                console.log(replies); // 101, 51
            });
        }
        else {
            console.error('Old data ', date);
        }
    } else {
        console.error('Wrong PASSKEY ', req.body.PASSKEY);
    }
    res.sendStatus(200);
}

function getStationLastData(req: any, res: any) {
    console.info('/getLastData/station');
    return getLastData(station, req, res);
}

function getDomLastData(req: any, res: any) {
    console.info('/getLastData/dom');
    return getLastData(dom, req, res);
}

function getLastData(measurement: IMeasurement, req: any, res: any) {
    res.type('application/json');
    redisClient.get(measurement.getRedisLastDataKey(), function (err: any, reply: any) {
        return res.json(JSON.parse(reply));
    });
}

function getStationTrendData(req: any, res: any) {
    console.info('/getTrendData/station');
    getTrendData(station, req, res);
}

function getDomTrendData(req: any, res: any) {
    console.info('/getTrendData/dom');
    getTrendData(dom, req, res);
}

function getTrendData(measurement: IMeasurement, req: any, res: any) {
    res.type('application/json');
    const now = Date.now();
    redisClient.zrangebyscore(measurement.getRedisTrendKey(), now - 3600000, now, function (err, result) {
        return res.json(measurement.transformTrendData(result));
    });
}

export default router;
