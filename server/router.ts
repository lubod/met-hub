import express from "express";
import { createClient } from "redis";
import verifyToken from "./utils";
import { socketEmiter, allStationsCfg } from "./main";
import { Dom } from "./dom";
import { IMeasurement } from "./measurement";
import { loadData, loadRainData } from "./load";
import { getForecast, getAstronomicalData } from "./forecast";

const dom = new Dom();
const router = express.Router();
const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

async function setData(
  measurement: IMeasurement,
  req: any,
  res: any,
  next: any,
  PASSKEY: string,
  data: any
) {
  // console.info(req.body);
  try {
    const { date, decoded, toStore } = measurement.decodeData(data);
    const now = Date.now();
    const diff = now - date.getTime();
    if (diff < 3600000) {
      socketEmiter.emit(measurement.getSocketChannel(), decoded);
      const multi = await redisClient
        .multi()
        .set(measurement.getRedisLastDataKey(), JSON.stringify(decoded))
        .zAdd(measurement.getRedisMinuteDataKey(), {
          score: date.getTime(),
          value: JSON.stringify(toStore),
        })
        .exec();
      console.info(multi);
    } else {
      console.error("Old data ", date);
      res.sendStatus(400);
    }
  } catch (err) {
    console.error("Error ", err);
    next(err);
  }
  res.sendStatus(200);
}

function setStationData(req: any, res: any, next: any) {
  console.info("/setData/station", req.body.PASSKEY);
  const { measurement } = allStationsCfg.getStationByPasskey(req.body.PASSKEY);
  // console.info(measurement);
  setData(measurement, req, res, next, req.body.PASSKEY, req.body);
}

function setDomData(req: any, res: any, next: any) {
  console.info("/setData/dom");
  setData(dom, req, res, next, req.body.PASSKEY, req.body);
}

async function getLastData(measurement: IMeasurement, req: any, res: any) {
  res.type("application/json");
  const reply = await redisClient.get(measurement.getRedisLastDataKey());
  res.json(JSON.parse(reply));
}

function getStationLastData(req: any, res: any) {
  console.info("/getLastData/station", req.params);
  if (allStationsCfg.getStationByID(req.params.stationID) != null) {
    const { measurement } = allStationsCfg.getStationByID(req.params.stationID);
    getLastData(measurement, req, res);
  } else {
    res.status(401).send("wrong station id");
  }
}

function getDomLastData(req: any, res: any) {
  console.info("/getLastData/dom");
  return getLastData(dom, req, res);
}

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

function getStationTrendData(req: any, res: any) {
  console.info("/getTrendData/station", req.params);
  if (allStationsCfg.getStationByID(req.params.stationID) != null) {
    const { measurement } = allStationsCfg.getStationByID(req.params.stationID);
    getTrendData(measurement, req, res);
  } else {
    res.status(401).send("wrong station id");
  }
}

function getDomTrendData(req: any, res: any) {
  console.info("/getTrendData/dom");
  getTrendData(dom, req, res);
}

router.post("/setData", setStationData);
router.get("/api/getLastData/station/:stationID", getStationLastData);
router.get("/api/getTrendData/station/:stationID", getStationTrendData);

router.post("/setDomData", setDomData);
router.get("/api/getLastData/dom", getDomLastData);
router.get("/api/getTrendData/dom", getDomTrendData);

router.get("/api/getUserProfile", (req: any, res: any) => {
  console.info("/getUserProfile");
  if (req.headers.authorization) {
    const user = verifyToken(req.headers.authorization.substr(7));
    if (user !== null) {
      res.type("application/json");
      res.json(user);
    }
    res.status(401).send("auth issue");
  } else {
    res.status(401).send("auth issue");
  }
  return null;
});

router.get("/api/getAllStationsCfg", (req: any, res: any) => {
  console.info("/getAllStationsCfg");
  res.type("application/json");

  if (req.headers.authorization) {
    const user = verifyToken(req.headers.authorization.substr(7));
    if (user !== null) {
      res.json(allStationsCfg.array);
    }
    res.json(allStationsCfg.array);
  }
  res.json(allStationsCfg.array);
});

router.get("/api/loadData", (req: any, res: any) => {
  console.info("/loadData", req.query);
  if (req.headers.authorization) {
    const user = verifyToken(req.headers.authorization.substr(7));
    if (user !== null) {
      res.type("application/json");
      if (
        req.query.start != null &&
        req.query.end != null &&
        req.query.measurement != null
      ) {
        const start = new Date(req.query.start);
        const end = new Date(req.query.end);
        const { measurement } = req.query;
        loadData(start, end, measurement, allStationsCfg).then((data) =>
          res.json(data)
        );
      } else {
        res.status(400).send("wrong params");
      }
    } else {
      res.status(401).send("auth issue");
    }
  } else {
    res.status(401).send("auth issue");
  }
});

router.get("/api/loadRainData", (req: any, res: any) => {
  console.info("/loadRainData", req.query);
  if (req.headers.authorization) {
    const user = verifyToken(req.headers.authorization.substr(7));
    if (user !== null) {
      res.type("application/json");
      loadRainData().then((data) => res.json(data));
    } else {
      res.status(401).send("auth issue");
    }
  } else {
    res.status(401).send("auth issue");
  }
});

router.get("/api/getForecast", (req: any, res: any) => {
  console.info("/getForecast", req.query);
  //  if (req.headers.authorization) {
  // const user = verifyToken(req.headers.authorization.substr(7));
  // if (user !== null) {
  res.type("application/json");
  if (req.query.lat != null && req.query.lon != null) {
    getForecast(req.query.lat, req.query.lon).then((data: any) =>
      res.json(data)
    );
  } else {
    res.status(400).send("wrong params");
  }
  // } else {
  //   res.status(401).send("auth issue");
  // }
  // } else {
  // res.status(401).send("auth issue");
  // }
});

router.get("/api/getAstronomicalData", (req: any, res: any, next: any) => {
  console.info("/getAstronomicalData", req.query);
  //  if (req.headers.authorization) {
  // const user = verifyToken(req.headers.authorization.substr(7));
  // if (user !== null) {
  res.type("application/json");
  if (req.query.lat != null && req.query.lon != null) {
    try {
      getAstronomicalData(
        req.query.lat,
        req.query.lon,
        new Date(req.query.date)
      ).then((data: any) => res.json(data));
    } catch (err) {
      console.error("Error ", err);
      next(err);
    }
  } else {
    res.status(400).send("wrong params");
  }
  // } else {
  //   res.status(401).send("auth issue");
  // }
  // } else {
  // res.status(401).send("auth issue");
  // }
});

router.get(
  "/weatherstation/updateweatherstation.php",
  (req: any, res: any, next: any) => {
    console.info("/weatherstation/updateweatherstation.php", req.query);
    if (req.query.ID != null) {
      try {
        const { measurement } = allStationsCfg.getStationByPasskey(
          req.query.ID
        );
        setData(measurement, req, res, next, req.query.ID, req.query);
      } catch (err) {
        console.error("Error ", err);
        next(err);
      }
    } else {
      res.status(400).send("wrong params");
    }
  }
);

export default router;
