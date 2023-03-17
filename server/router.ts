import express from "express";
import { createClient } from "redis";
import { Kafka, Producer } from "kafkajs";
import { createToken, verifyToken } from "./utils";
import { socketEmiter, allStationsCfg, AppError } from "./main";
import { Dom } from "./dom";
import { IMeasurement } from "./measurement";
import { loadData, loadRainData } from "./load";
import { getForecast, getAstronomicalData } from "./forecast";
import { IStation } from "../common/allStationsCfg";
import { goSelect } from "./go";

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.CLIENT_ID);

const dom = new Dom();
const router = express.Router();
const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

const kafka = new Kafka({
  clientId: "setData",
  brokers: ["localhost:9092"],
});

const producer: Producer = kafka.producer();

function checkAuth(req: any) {
  if (process.env.ENV === "dev") { // todo
    console.info("dev auth");
    return;
  }
  if (req.headers.authorization) {
    const user = verifyToken(req.headers.authorization.substr(7));
    if (user !== null) {
      return;
    }
  }
  throw new AppError(401, "Auth issue");
}

function catchAsync(fnc: Function) {
  return (req: any, res: any, next: any) => {
    fnc(req, res, next).catch((err: any) => next(err));
  };
}
// LAST DATA

async function getLastData(measurement: IMeasurement, req: any, res: any) {
  const reply = await redisClient.get(measurement.getRedisLastDataKey());
  res.status(200).json(JSON.parse(reply));
}

router.get(
  "/api/getLastData/station/:stationID",
  catchAsync(async (req: any, res: any) => {
    if (allStationsCfg.getStationByID(req.params.stationID) != null) {
      const { measurement } = allStationsCfg.getStationByID(
        req.params.stationID
      );
      getLastData(measurement, req, res);
    } else {
      throw new AppError(400, "Invalid params");
    }
  })
);

router.get(
  "/api/getLastData/dom",
  catchAsync(async (req: any, res: any) => {
    checkAuth(req);
    getLastData(dom, req, res);
  })
);

// TREND DATA

async function getTrendData(measurement: IMeasurement, req: any, res: any) {
  const now = Date.now();
  const reply = await redisClient.zRangeByScore(
    measurement.getRedisTrendKey(),
    now - 3600000,
    now
  );
  res.status(200).json(measurement.transformTrendData(reply));
}

router.get(
  "/api/getTrendData/station/:stationID",
  catchAsync(async (req: any, res: any) => {
    if (allStationsCfg.getStationByID(req.params.stationID) != null) {
      const { measurement } = allStationsCfg.getStationByID(
        req.params.stationID
      );
      await getTrendData(measurement, req, res);
    } else {
      throw new AppError(400, "Invalid params");
    }
  })
);

router.get(
  "/api/getTrendData/dom",
  catchAsync(async (req: any, res: any) => {
    checkAuth(req);
    await getTrendData(dom, req, res);
  })
);

// CFG & AUTH

router.post(
  "/api/googleLogin",
  catchAsync(async (req: any, res: any) => {
    const  gtoken  = req.body.token;
    const ticket = await client.verifyIdToken({
      idToken: gtoken,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const {token, expiresAt, duration} = createToken(payload.sub);
    await redisClient.hSet("USERS", payload.sub, JSON.stringify(payload));
    /*  const user = await db.user.upsert({
    where: { email: email },
    update: { name, picture },
    create: { name, email, picture },
  }); */

    res.status(200).json({token, given_name:payload.given_name, family_name: payload.family_name, expiresAt, duration});
  })
);

router.get(
  "/api/getUserProfile",
  catchAsync(async (req: any, res: any) => {
    if (req.headers.authorization) {
      const user = verifyToken(req.headers.authorization.substr(7));
      if (user !== null) {
        res.status(200).json(user);
      } else {
        throw new AppError(401, "Auth issue");
      }
    } else {
      throw new AppError(401, "Auth issue");
    }
  })
);

router.get(
  "/api/getAllStationsCfg",
  catchAsync(async (req: any, res: any) => {
    if (req.headers.authorization) {
      const user = verifyToken(req.headers.authorization.substr(7));
      if (user !== null) {
        res.status(200).json(allStationsCfg.array); // TODO
      }
      res.status(200).json(allStationsCfg.array); // TODO
    }
    res.status(200).json(allStationsCfg.array);
  })
);

// LOAD

router.get(
  "/api/loadData",
  catchAsync(async (req: any, res: any) => {
    checkAuth(req);
    if (
      req.query.start != null &&
      req.query.end != null &&
      req.query.measurement != null
    ) {
      const start = new Date(req.query.start);
      const end = new Date(req.query.end);
      const { measurement } = req.query;
      const data = await loadData(start, end, measurement, allStationsCfg);
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  })
);

router.get(
  "/api/loadRainData/station/:stationID",
  catchAsync(async (req: any, res: any) => {
    checkAuth(req);
    if (req.params.stationID != null) {
      const data = await loadRainData(req.params.stationID);
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  })
);

// FORECAST

router.get(
  "/api/getForecast",
  catchAsync(async (req: any, res: any) => {
    if (req.query.lat != null && req.query.lon != null) {
      const data = await getForecast(req.query.lat, req.query.lon);
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  })
);

router.get(
  "/api/getAstronomicalData",
  catchAsync(async (req: any, res: any) => {
    console.info("/getAstronomicalData", req.query);
    if (
      req.query.lat != null &&
      req.query.lon != null &&
      req.query.date != null
    ) {
      const data = await getAstronomicalData(
        req.query.lat,
        req.query.lon,
        new Date(req.query.date)
      );
      // console.info(data);
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  })
);

// SET DATA

async function setData(PASSKEY: string, data: any) {
  if (PASSKEY != null) {
    const station: IStation = allStationsCfg.getStationByPasskey(PASSKEY);
    if (station != null) {
      const { measurement } = allStationsCfg.getStationByPasskey(PASSKEY);
      const { date, decoded, toStore } = measurement.decodeData(data);
      const now = Date.now();
      const diff = now - date.getTime();
      if (diff < 3600000) {
        socketEmiter.emit(measurement.getSocketChannel(), decoded);
        await redisClient
          .multi()
          .set(measurement.getRedisLastDataKey(), JSON.stringify(decoded))
          .zAdd(measurement.getRedisMinuteDataKey(), {
            score: date.getTime(),
            value: JSON.stringify(toStore),
          })
          .exec();
        await producer.connect();
        // todo
        await producer.send({
          topic: "data",
          messages: [
            {
              key: measurement.getKafkaKey(),
              value: JSON.stringify(toStore),
            },
          ],
        });
      } else {
        throw new AppError(400, `Old data ${date}`);
      }
    } else {
      throw new AppError(400, "Unknown PASSKEY");
    }
  } else {
    throw new AppError(400, "Invalid PASSKEY");
  }
}

router.get(
  "/weatherstation/updateweatherstation.php",
  catchAsync(async (req: any, res: any) => {
    await setData(req.query.ID, req.query);
    res.sendStatus(200);
  })
);

router.post(
  "/setData",
  catchAsync(async (req: any, res: any) => {
    await setData(req.body.PASSKEY, req.body);
    res.sendStatus(200);
  })
);

router.post(
  "/setDomData",
  catchAsync(async (req: any, res: any) => {
    await setData(req.body.PASSKEY, req.body);
    res.sendStatus(200);
  })
);

// GO

router.get(
  "/api/goSelect",
  catchAsync(async (req: any, res: any) => {
    // checkAuth(req);
    if (
      req.query.air_temperature_min != null &&
      req.query.air_temperature_max != null &&
      req.query.cloud_area_fraction_min != null &&
      req.query.cloud_area_fraction_max != null &&
      req.query.fog_area_fraction_min != null &&
      req.query.fog_area_fraction_max != null &&
      req.query.wind_speed_min != null &&
      req.query.wind_speed_max != null &&
      req.query.hour_min != null &&
      req.query.hour_max != null &&
      req.query.precipitation_amount_min != null &&
      req.query.precipitation_amount_max != null
    ) {
      const data = goSelect(
        req.query.air_temperature_min,
        req.query.air_temperature_max,
        req.query.cloud_area_fraction_min,
        req.query.cloud_area_fraction_max,
        req.query.fog_area_fraction_min,
        req.query.fog_area_fraction_max,
        req.query.wind_speed_min,
        req.query.wind_speed_max,
        req.query.hour_min,
        req.query.hour_max,
        req.query.precipitation_amount_min,
        req.query.precipitation_amount_max
      );
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  })
);

export default router;
