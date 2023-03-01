import express from "express";
import { createClient } from "redis";
import { Kafka, Producer } from "kafkajs";
import verifyToken from "./utils";
import { socketEmiter, allStationsCfg, AppError } from "./main";
import { Dom } from "./dom";
import { IMeasurement } from "./measurement";
import { loadData, loadRainData } from "./load";
import { getForecast, getAstronomicalData } from "./forecast";
import { IStation } from "../common/allStationsCfg";
import { goSelect } from "./go";

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
  if (req.headers.authorization) {
    const user = verifyToken(req.headers.authorization.substr(7));
    if (user !== null) {
      return;
    }
  }
  throw new AppError(401, "Auth issue");
}

// LAST DATA

async function getLastData(measurement: IMeasurement, req: any, res: any) {
  res.type("application/json");
  const reply = await redisClient.get(measurement.getRedisLastDataKey());
  res.json(JSON.parse(reply));
}

router.get("/api/getLastData/station/:stationID", (req: any, res: any) => {
  if (allStationsCfg.getStationByID(req.params.stationID) != null) {
    const { measurement } = allStationsCfg.getStationByID(req.params.stationID);
    getLastData(measurement, req, res);
  } else {
    throw new AppError(400, "Invalid params");
  }
});

router.get("/api/getLastData/dom", (req: any, res: any) => {
  checkAuth(req);
  getLastData(dom, req, res);
});

// TREND DATA

async function getTrendData(measurement: IMeasurement, req: any, res: any) {
  res.type("application/json");
  const now = Date.now();
  const reply = await redisClient.zRangeByScore(
    measurement.getRedisTrendKey(),
    now - 3600000,
    now
  );
  res.json(measurement.transformTrendData(reply));
}

router.get("/api/getTrendData/station/:stationID", (req: any, res: any) => {
  if (allStationsCfg.getStationByID(req.params.stationID) != null) {
    const { measurement } = allStationsCfg.getStationByID(req.params.stationID);
    getTrendData(measurement, req, res);
  } else {
    throw new AppError(400, "Invalid params");
  }
});

router.get("/api/getTrendData/dom", (req: any, res: any) => {
  checkAuth(req);
  getTrendData(dom, req, res);
});

// CFG

router.get("/api/getUserProfile", (req: any, res: any) => {
  if (req.headers.authorization) {
    const user = verifyToken(req.headers.authorization.substr(7));
    if (user !== null) {
      res.type("application/json");
      res.json(user);
    } else {
      throw new AppError(401, "Auth issue");
    }
  } else {
    throw new AppError(401, "Auth issue");
  }
  return null;
});

router.get("/api/getAllStationsCfg", (req: any, res: any) => {
  res.type("application/json");
  if (req.headers.authorization) {
    const user = verifyToken(req.headers.authorization.substr(7));
    if (user !== null) {
      res.json(allStationsCfg.array); // TODO
    }
    res.json(allStationsCfg.array); // TODO
  }
  res.json(allStationsCfg.array);
});

// LOAD

router.get("/api/loadData", (req: any, res: any) => {
  checkAuth(req);
  if (
    req.query.start != null &&
    req.query.end != null &&
    req.query.measurement != null
  ) {
    res.type("application/json");
    const start = new Date(req.query.start);
    const end = new Date(req.query.end);
    const { measurement } = req.query;
    loadData(start, end, measurement, allStationsCfg)
      .then((data) => res.json(data))
      .catch((e) => {
        throw new AppError(500, `${e.name}: ${e.message}`, e.stack);
      });
  } else {
    throw new AppError(400, "Invalid params");
  }
});

router.get("/api/loadRainData/station/:stationID", (req: any, res: any) => {
  checkAuth(req);
  if (req.params.stationID != null) {
    res.type("application/json");
    loadRainData(req.params.stationID)
      .then((data) => res.json(data))
      .catch((e) => {
        throw new AppError(500, `${e.name}: ${e.message}`, e.stack);
      });
  } else {
    throw new AppError(400, "Invalid params");
  }
});

// FORECAST

router.get("/api/getForecast", (req: any, res: any) => {
  if (req.query.lat != null && req.query.lon != null) {
    res.type("application/json");
    getForecast(req.query.lat, req.query.lon)
      .then((data: any) => res.json(data))
      .catch((e) => {
        throw new AppError(500, `${e.name}: ${e.message}`, e.stack);
      });
  } else {
    throw new AppError(400, "Invalid params");
  }
});

router.get("/api/getAstronomicalData", (req: any, res: any) => {
  console.info("/getAstronomicalData", req.query);
  if (
    req.query.lat != null &&
    req.query.lon != null &&
    req.query.date != null
  ) {
    getAstronomicalData(req.query.lat, req.query.lon, new Date(req.query.date))
      .then((data: any) => res.json(data))
      .catch((e) => {
        throw new AppError(500, `${e.name}: ${e.message}`, e.stack);
      });
  } else {
    throw new AppError(400, "Invalid params");
  }
});

// SET DATA

function setData(PASSKEY: string, data: any) {
  if (PASSKEY != null) {
    const station: IStation = allStationsCfg.getStationByPasskey(PASSKEY);
    if (station != null) {
      const { measurement } = allStationsCfg.getStationByPasskey(PASSKEY);
      const { date, decoded, toStore } = measurement.decodeData(data);
      const now = Date.now();
      const diff = now - date.getTime();
      if (diff < 3600000) {
        socketEmiter.emit(measurement.getSocketChannel(), decoded);
        redisClient
          .multi()
          .set(measurement.getRedisLastDataKey(), JSON.stringify(decoded))
          .zAdd(measurement.getRedisMinuteDataKey(), {
            score: date.getTime(),
            value: JSON.stringify(toStore),
          })
          .exec()
          .then((multi) => console.info(multi))
          .catch((e) => {
            throw new AppError(500, `${e.name}: ${e.message}`, e.stack);
          });
        producer.connect().then(() =>
          // todo
          producer.send({
            topic: "data",
            messages: [
              {
                key: measurement.getKafkaKey(),
                value: JSON.stringify(toStore),
              },
            ],
          })
        );
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

router.get("/weatherstation/updateweatherstation.php", (req: any, res: any) => {
  setData(req.query.ID, req.query);
  res.sendStatus(200);
});

router.post("/setData", (req: any, res: any) => {
  setData(req.body.PASSKEY, req.body);
  res.sendStatus(200);
});

router.post("/setDomData", (req: any, res: any) => {
  setData(req.body.PASSKEY, req.body);
  res.sendStatus(200);
});

// GO

router.get("/api/goSelect", (req: any, res: any) => {
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
    res.type("application/json");
    goSelect(
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
    )
      .then((data) => res.json(data))
      .catch((e) => {
        throw new AppError(500, `${e.name}: ${e.message}`, e.stack);
      });
  } else {
    throw new AppError(400, "Invalid params");
  }
});

export default router;
