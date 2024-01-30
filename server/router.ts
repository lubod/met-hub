import express from "express";
import { createClient } from "redis";
import { createToken, verifyToken } from "./utils";
import { allStationsCfg, AppError } from "./main";
import { Dom } from "./dom";
import { IMeasurement } from "./measurement";
import { loadData, loadRainData } from "./db";
import { getForecast, getAstronomicalData } from "./forecast";
import { goSelect } from "./go";
import { IStation } from "../common/allStationsCfg";

const { OAuth2Client } = require("google-auth-library");

const clietOAuth = new OAuth2Client(process.env.CLIENT_ID);

const dom = new Dom();
const router = express.Router();
const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

interface IUser {
  id: any;
  given_name: string;
  family_name: string;
  createdAt: number;
  expiresAt: number;
}

async function checkAuth(req: any, silent: boolean = false) {
  if (req.cookies.jwt) {
    const { id, exp, iat } = verifyToken(req.cookies.jwt);
    if (id != null) {
      const payload = JSON.parse(await redisClient.hGet("USERS", id));
      // todo check if user still exists
      if (payload != null) {
        return {
          id,
          given_name: payload.given_name,
          family_name: payload.family_name,
          createdAt: iat * 1000,
          expiresAt: exp * 1000,
        } as IUser;
      }
    }
  }
  if (silent) {
    return null;
  }
  throw new AppError(401, "Auth issue");
}

async function checkAccess(
  user: IUser,
  stationID: string,
  ownerOnly: boolean = true,
) {
  let mys = null;
  if (user != null) {
    mys = allStationsCfg.getStationsByUser(user.id);
    const admin = await redisClient.hGet("USERS", "admin");
    if (user.id === admin) {
      console.info("ACCESS ADMIN", user, stationID, ownerOnly);
      return true;
    }
  }
  const publicStations = allStationsCfg.getPublicStations();
  console.info(mys, publicStations);
  if (ownerOnly) {
    if (mys != null && mys.has(stationID)) {
      console.info("ACCESS", user, stationID, ownerOnly);
      return true;
    }
  } else if (
    (publicStations != null && publicStations.has(stationID)) ||
    (mys != null && mys.has(stationID))
  ) {
    console.info("ACCESS", user, stationID, ownerOnly);
    return true;
  }
  console.info("NO ACCESS", user, stationID, ownerOnly);
  throw new AppError(403, "Access issue");
}

function catchAsync(fnc: Function) {
  return (req: any, res: any, next: any) => {
    fnc(req, res, next).catch((err: any) => next(err));
  };
}

// SSE

let clients: any[] = [];

export const writeEvent = (data: string, type: "raw" | "ping" | "minute") => {
  clients.forEach((client) => {
    client.res.write(`data: ${data}:${type}\n\n`);
    console.info(`${client.id} Connection used ${data} ${type}`);
  });
};

setInterval(() => writeEvent("-", "ping"), 30000);

function eventHandler(req: any, res: any) {
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };
  clients.push(newClient);
  console.info(`${clientId} Connection opened`);

  req.on("close", () => {
    console.info(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

router.get("/events", (req: any, res: any) => {
  if (req.headers.accept === "text/event-stream") {
    eventHandler(req, res);
  } else {
    res.json({ message: "Ok" });
  }
});

// LAST DATA

async function getLastData(measurement: IMeasurement, req: any, res: any) {
  const user = await checkAuth(req, true);
  await checkAccess(user, measurement.getStationID(), false);
  const reply = await redisClient.get(measurement.getRedisLastDataKey());
  res.status(200).json(JSON.parse(reply));
}

router.get(
  "/api/getLastData/station/:stationID",
  catchAsync(async (req: any, res: any) => {
    if (allStationsCfg.getStationByID(req.params.stationID) != null) {
      const { measurement } = allStationsCfg.getStationByID(
        req.params.stationID,
      );
      await getLastData(measurement, req, res);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/getLastData/dom",
  catchAsync(async (req: any, res: any) => {
    await getLastData(dom, req, res);
  }),
);

// TREND DATA

async function getTrendData(measurement: IMeasurement, req: any, res: any) {
  const user = await checkAuth(req, true);
  await checkAccess(user, measurement.getStationID(), false);
  const now = Date.now();
  const reply = await redisClient.zRangeByScore(
    measurement.getRedisTrendKey(),
    now - 3600000,
    now,
  );
  res.status(200).json(measurement.transformTrendData(reply));
}

router.get(
  "/api/getTrendData/station/:stationID",
  catchAsync(async (req: any, res: any) => {
    if (allStationsCfg.getStationByID(req.params.stationID) != null) {
      const { measurement } = allStationsCfg.getStationByID(
        req.params.stationID,
      );
      await getTrendData(measurement, req, res);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/getTrendData/dom",
  catchAsync(async (req: any, res: any) => {
    await getTrendData(dom, req, res);
  }),
);

// CFG & AUTH

router.get(
  "/api/logout",
  catchAsync(async (req: any, res: any) => {
    res.clearCookie("jwt").status(200).json({});
  }),
);

router.post(
  "/api/googleLogin",
  catchAsync(async (req: any, res: any) => {
    const gtoken = req.body.token;
    console.info(req.body, gtoken);
    const ticket = await clietOAuth.verifyIdToken({
      idToken: gtoken,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { token, createdAt, expiresAt } = createToken(payload.sub);
    await redisClient.hSet("USERS", payload.sub, JSON.stringify(payload));
    /*  const user = await db.user.upsert({
    where: { email: email },
    update: { name, picture },
    create: { name, email, picture },
  }); */
    res
      .cookie("jwt", token, {
        expires: new Date(expiresAt),
        secure: process.env.ENV !== "dev",
        httpOnly: true,
      })
      .status(200)
      .json({
        id: payload.sub,
        given_name: payload.given_name,
        family_name: payload.family_name,
        createdAt,
        expiresAt,
      } as IUser);
  }),
);

router.get(
  "/api/getUserProfile",
  catchAsync(async (req: any, res: any) => {
    const user = await checkAuth(req, true);
    if (user != null) {
      const admin = await redisClient.hGet("USERS", "admin");
      res.status(200).json({ admin, user });
    } else {
      res.status(200).json(null);
    }
  }),
);

router.get(
  "/api/getAllStationsCfg",
  catchAsync(async (req: any, res: any) => {
    let user = null;
    const result: Array<IStation> = [];
    if (req.cookies.jwt) {
      user = await checkAuth(req);
    }
    const rs = new Set<string>();

    if (user != null) {
      const mys = allStationsCfg.getStationsByUser(user.id);
      if (mys != null) {
        for (const sid of mys) {
          rs.add(sid);
        }
      }
    }

    const publicStationIDs = allStationsCfg.getPublicStations();
    if (publicStationIDs != null) {
      for (const sid of publicStationIDs) {
        rs.add(sid);
      }
    }

    for (const sid of rs) {
      const station: IStation = allStationsCfg.getStationByID(sid);
      const cStation = {} as IStation;
      cStation.id = station.id;
      cStation.lat = station.lat;
      cStation.lon = station.lon;
      cStation.place = station.place;
      cStation.type = station.type;
      cStation.public = station.public;
      cStation.owner = station.owner;
      result.push(cStation);
    }
    res.status(200).json(result);
  }),
);

// LOAD

router.get(
  "/api/loadData",
  catchAsync(async (req: any, res: any) => {
    if (
      req.query.stationID != null &&
      req.query.start != null &&
      req.query.end != null &&
      req.query.measurement != null
    ) {
      const start = new Date(req.query.start);
      const end = new Date(req.query.end);
      const { measurement } = req.query;
      const { stationID } = req.query;
      const user = await checkAuth(req, true);
      await checkAccess(user, stationID);
      const data = await loadData(
        stationID,
        start,
        end,
        measurement,
        allStationsCfg,
      );
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/loadRainData/station/:stationID",
  catchAsync(async (req: any, res: any) => {
    if (req.params.stationID != null) {
      const user = await checkAuth(req);
      await checkAccess(user, req.params.stationID);
      const data = await loadRainData(req.params.stationID);
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
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
  }),
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
        new Date(req.query.date),
      );
      // console.info(data);
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

// SET DATA

async function setData(PASSKEY: string, id: string, data: any) {
  if (PASSKEY != null || id != null) {
    let station: IStation = null;
    if (PASSKEY != null) {
      station = allStationsCfg.getStationByPasskey(PASSKEY);
    }
    if (id != null) {
      station = allStationsCfg.getStationByID(id);
    }
    if (station != null) {
      const { measurement } = station;
      const { date, decoded } = measurement.decodeData(data, station.place);
      const now = Date.now();
      const diff = now - date.getTime();
      if (diff < 3600000) {
        await redisClient
          .multi()
          .set(measurement.getRedisLastDataKey(), JSON.stringify(decoded))
          .zAdd(measurement.getRedisRawDataKey(), {
            score: date.getTime(),
            value: JSON.stringify(decoded),
          })
          .exec();
        // sse
        writeEvent(station.id, "raw");
      } else {
        throw new AppError(400, `Old data ${date}`);
      }
    } else {
      throw new AppError(400, "Unknown PASSKEY or ID");
    }
  } else {
    throw new AppError(400, "Invalid PASSKEY or ID");
  }
}

router.get(
  "/weatherstation/updateweatherstation.php",
  catchAsync(async (req: any, res: any) => {
    await setData(req.query.ID, null, req.query); // ID is PASSKEY in this case
    res.sendStatus(200);
  }),
);

router.post(
  "/setData",
  catchAsync(async (req: any, res: any) => {
    await setData(req.body.PASSKEY, null, req.body);
    res.sendStatus(200);
  }),
);

router.post(
  "/setData/:stationID",
  catchAsync(async (req: any, res: any) => {
    await setData(null, req.params.stationID, req.body);
    res.sendStatus(200);
  }),
);

router.post(
  "/setDomData",
  catchAsync(async (req: any, res: any) => {
    await setData(req.body.PASSKEY, null, req.body);
    res.sendStatus(200);
  }),
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
        req.query.precipitation_amount_max,
      );
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

// add station
router.post(
  "/api/addStation",
  catchAsync(async (req: any, res: any) => {
    if (
      req.body.lat != null &&
      req.body.lon != null &&
      req.body.place != null &&
      req.body.type != null
    ) {
      const user = await checkAuth(req);

      // add station to cfg
      // lat lon type place passkey owner id
      const { lat, lon, place, passkey, type } = req.body;
      if (type !== "GoGen Me 3900") {
        throw new AppError(400, `Unknown station type ${type}`);
      }
      const owner = user.id;
      const id = Math.random().toString(36).substring(2, 10);
      const exists = allStationsCfg.getStationByPasskey(passkey);
      if (exists) {
        throw new AppError(400, `Station with ${passkey} already exists`);
      }
      const count = allStationsCfg.getStationsByUser(owner).size;
      if (count > 3) {
        // todo
        throw new AppError(400, `Max number of stations per user: ${count}`);
      }
      const station = {} as IStation;
      station.id = id;
      station.lat = lat;
      station.lon = lon;
      station.owner = owner;
      station.passkey = passkey;
      station.place = place;
      station.measurement = null;
      station.public = true;
      station.type = type;
      allStationsCfg.addStation(station);
      console.info("ADD", station);

      res.status(200).json({ id });
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

export default router;
