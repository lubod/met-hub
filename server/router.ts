import express from 'express';
import { getDomLastData, getDomTrendData, setDomData } from './dom';
import { getStationLastData, getStationTrendData, setStationData } from './station';
import { verifyToken } from './utils';

const router = express.Router();

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

export default router;
