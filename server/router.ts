import express, { Request, Response, NextFunction, RequestHandler } from "express";
import crypto from "crypto";
import { StationType } from "../common/stationType";
import { createToken, verifyToken } from "./utils";
import redisClient from "./redisClient";
import { allStationsCfg, AppError } from "./main";
import { Dom } from "./dom";
import { IMeasurement } from "./measurement";
import { loadData, loadRainData } from "./db";
import { getForecast, getAstronomicalData } from "./forecast";
import { IStation } from "../common/allStationsCfg";

const { OAuth2Client } = require("google-auth-library");

const clientOAuth = new OAuth2Client(process.env.CLIENT_ID);

const dom = new Dom();
const router = express.Router();

interface IUser {
  id: string;
  given_name: string;
  family_name: string;
  createdAt: number;
  expiresAt: number;
}

// Cache admin ID for 60 seconds to avoid a Redis fetch on every request
let cachedAdminId: string | null = null;
let adminCacheExpiry = 0;

async function getAdminId(): Promise<string | null> {
  const now = Date.now();
  if (cachedAdminId !== null && now < adminCacheExpiry) {
    return cachedAdminId;
  }
  cachedAdminId = await redisClient.hGet("USERS", "admin");
  adminCacheExpiry = now + 60_000;
  return cachedAdminId;
}

async function checkAuth(req: Request, silent: boolean = false): Promise<IUser | null> {
  if (req.cookies.jwt) {
    const decoded = verifyToken(req.cookies.jwt);
    if (decoded != null && decoded.id != null) {
      const raw = await redisClient.hGet("USERS", decoded.id);
      if (raw != null) {
        let payload: { given_name?: string; family_name?: string } | null = null;
        try {
          payload = JSON.parse(raw);
        } catch {
          // corrupt Redis entry – treat as not authenticated
        }
        if (payload != null) {
          return {
            id: decoded.id,
            given_name: payload.given_name ?? "",
            family_name: payload.family_name ?? "",
            createdAt: decoded.iat * 1000,
            expiresAt: decoded.exp * 1000,
          };
        }
      }
    }
  }
  if (silent) {
    return null;
  }
  throw new AppError(401, "Auth issue");
}

async function checkAccess(
  user: IUser | null,
  stationID: string,
  ownerOnly: boolean = true,
): Promise<void> {
  if (user != null) {
    const admin = await getAdminId();
    if (user.id === admin) {
      return;
    }
    const mys = allStationsCfg.getStationsByUser(user.id);
    if (mys != null && mys.has(stationID)) {
      return;
    }
  }
  if (!ownerOnly) {
    const publicStations = allStationsCfg.getPublicStations();
    if (publicStations != null && publicStations.has(stationID)) {
      return;
    }
  }
  throw new AppError(403, "Access issue");
}

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

function catchAsync(fnc: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    fnc(req, res, next).catch(next);
  };
}

// SSE

const clients = new Map<number, Response>();
let lastEventTime = 0;
let nextClientId = 1;

export const writeEvent = (data: string, type: "raw" | "ping" | "minute") => {
  if (type === "ping" && Date.now() - lastEventTime < 30000) {
    return;
  }
  for (const [id, res] of clients) {
    try {
      res.write(`data: ${data}:${type}\n\n`);
    } catch {
      console.info(`${id} SSE write failed, removing client`);
      clients.delete(id);
    }
  }
  lastEventTime = Date.now();
};

setInterval(() => writeEvent("-", "ping"), 30000);

function eventHandler(req: Request, res: Response) {
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });

  const clientId = nextClientId;
  nextClientId += 1;
  clients.set(clientId, res);
  console.info(`${clientId} Connection opened`);

  req.on("close", () => {
    console.info(`${clientId} Connection closed`);
    clients.delete(clientId);
  });
}

router.get("/events", (req: Request, res: Response) => {
  if (req.headers.accept === "text/event-stream") {
    eventHandler(req, res);
  } else {
    res.json({ message: "Ok" });
  }
});

// LAST DATA

async function getLastData(measurement: IMeasurement, req: Request, res: Response) {
  const user = await checkAuth(req, true);
  await checkAccess(user, measurement.getStationID(), false);
  const reply = await redisClient.get(measurement.getRedisLastDataKey());
  res.status(200).json(reply != null ? JSON.parse(reply) : null);
}

router.get(
  "/api/getLastData/station/:stationID",
  catchAsync(async (req, res) => {
    const station = allStationsCfg.getStationByID(req.params.stationID);
    if (station != null) {
      await getLastData(station.measurement, req, res);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/getLastData/dom",
  catchAsync(async (req, res) => {
    await getLastData(dom, req, res);
  }),
);

// TREND DATA

async function getTrendData(measurement: IMeasurement, req: Request, res: Response) {
  const user = await checkAuth(req, true);
  await checkAccess(user, measurement.getStationID(), false);
  const now = Date.now();
  const reply = await redisClient.zRangeByScore(
    measurement.getRedisTrendKey(),
    now - 3600000,
    now,
  );
  res.status(200).json(reply.length > 0 ? measurement.transformTrendData(reply) : null);
}

router.get(
  "/api/getTrendData/station/:stationID",
  catchAsync(async (req, res) => {
    const station = allStationsCfg.getStationByID(req.params.stationID);
    if (station != null) {
      await getTrendData(station.measurement, req, res);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/getTrendData/dom",
  catchAsync(async (req, res) => {
    await getTrendData(dom, req, res);
  }),
);

// CFG & AUTH

router.get(
  "/api/logout",
  catchAsync(async (req, res) => {
    res.clearCookie("jwt").status(200).json({});
  }),
);

router.post(
  "/api/googleLogin",
  catchAsync(async (req, res) => {
    const gtoken = req.body.token;
    const ticket = await clientOAuth.verifyIdToken({
      idToken: gtoken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload.email_verified) {
      throw new AppError(401, "Email not verified");
    }
    const { token, createdAt, expiresAt } = createToken(payload.sub);
    const userRecord = {
      given_name: payload.given_name,
      family_name: payload.family_name,
      email: payload.email,
    };
    await redisClient.hSet("USERS", payload.sub, JSON.stringify(userRecord));
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
  catchAsync(async (req, res) => {
    const user = await checkAuth(req, true);
    if (user != null) {
      const admin = await getAdminId();
      res.status(200).json({ admin, user });
    } else {
      res.status(200).json(null);
    }
  }),
);

router.get(
  "/api/getAllStationsCfg",
  catchAsync(async (req, res) => {
    let user: IUser | null = null;
    const result: Array<Partial<IStation>> = [];
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
      const station = allStationsCfg.getStationByID(sid);
      if (station == null) continue;
      result.push({
        id: station.id,
        lat: station.lat,
        lon: station.lon,
        place: station.place,
        type: station.type,
        public: station.public,
        owner: station.owner,
      });
    }
    res.status(200).json(result);
  }),
);

// LOAD

router.get(
  "/api/loadData",
  catchAsync(async (req, res) => {
    if (
      req.query.stationID != null &&
      req.query.start != null &&
      req.query.end != null &&
      req.query.measurement != null
    ) {
      const start = new Date(req.query.start as string);
      const end = new Date(req.query.end as string);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError(400, "Invalid date params");
      }
      if (start >= end) {
        throw new AppError(400, "start must be before end");
      }
      const diffDays = (end.getTime() - start.getTime()) / 86_400_000;
      if (diffDays > 366) {
        throw new AppError(400, "Date range too large (max 366 days)");
      }
      const { measurement, stationID } = req.query as { measurement: string; stationID: string };
      const user = await checkAuth(req, true);
      await checkAccess(user, stationID);
      const data = await loadData(stationID, start, end, measurement, allStationsCfg);
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/loadRainData/station/:stationID",
  catchAsync(async (req, res) => {
    const { stationID } = req.params;
    const user = await checkAuth(req);
    await checkAccess(user, stationID);
    const data = await loadRainData(stationID);
    res.status(200).json(data);
  }),
);

// FORECAST

router.get(
  "/api/getForecast",
  catchAsync(async (req, res) => {
    if (req.query.lat != null && req.query.lon != null) {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new AppError(400, "Invalid lat/lon");
      }
      const data = await getForecast(String(lat), String(lon));
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/getAstronomicalData",
  catchAsync(async (req, res) => {
    if (req.query.lat != null && req.query.lon != null && req.query.date != null) {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new AppError(400, "Invalid lat/lon");
      }
      const date = new Date(req.query.date as string);
      if (isNaN(date.getTime())) {
        throw new AppError(400, "Invalid date");
      }
      const data = await getAstronomicalData(String(lat), String(lon), date);
      res.status(200).json(data);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

// SET DATA

async function setData(PASSKEY: string | null, id: string | null, data: any) {
  if (PASSKEY == null && id == null) {
    throw new AppError(400, "Invalid PASSKEY or ID");
  }
  let station: IStation | undefined;
  if (id != null) {
    station = allStationsCfg.getStationByID(id);
  } else if (PASSKEY != null) {
    station = allStationsCfg.getStationByPasskey(PASSKEY);
  }
  if (station == null) {
    throw new AppError(400, "Unknown PASSKEY or ID");
  }
  const { measurement } = station;
  const { date, decoded } = measurement.decodeData(data, station.place);
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff >= 3600000) {
    throw new AppError(400, `Old data ${date}`);
  }
  await redisClient
    .multi()
    .set(measurement.getRedisLastDataKey(), JSON.stringify(decoded))
    .zAdd(measurement.getRedisRawDataKey(), {
      score: date.getTime(),
      value: JSON.stringify(decoded),
    })
    .exec();
  writeEvent(station.id, "raw");
}

router.get(
  "/weatherstation/updateweatherstation.php",
  catchAsync(async (req, res) => {
    const stationID = typeof req.query.ID === "string" ? req.query.ID : null;
    await setData(stationID, null, req.query);
    res.sendStatus(200);
  }),
);

router.post(
  "/setData",
  catchAsync(async (req, res) => {
    await setData(req.body.PASSKEY, null, req.body);
    res.sendStatus(200);
  }),
);

router.post(
  "/setData/:stationID",
  catchAsync(async (req, res) => {
    await setData(null, req.params.stationID, req.body);
    res.sendStatus(200);
  }),
);

router.post(
  "/setDomData",
  catchAsync(async (req, res) => {
    await setData(req.body.PASSKEY, null, req.body);
    res.sendStatus(200);
  }),
);

// add station
router.post(
  "/api/addStation",
  catchAsync(async (req, res) => {
    if (
      req.body.lat != null &&
      req.body.lon != null &&
      req.body.place != null &&
      req.body.type != null
    ) {
      const user = await checkAuth(req);

      const { lat, lon, place, passkey, type } = req.body;

      if (type !== StationType.GoGenMe3900) {
        throw new AppError(400, `Unknown station type ${type}`);
      }

      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      if (!Number.isFinite(latNum) || !Number.isFinite(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
        throw new AppError(400, "Invalid lat/lon values");
      }

      const trimPlace = String(place).trim();
      if (trimPlace === "") {
        throw new AppError(400, "Empty place name");
      }
      if (trimPlace.length > 100) {
        throw new AppError(400, "Place name too long");
      }

      if (!passkey || String(passkey).trim() === "") {
        throw new AppError(400, "Passkey is required");
      }

      const owner = user.id;
      const exists = allStationsCfg.getStationByPasskey(passkey);
      if (exists) {
        throw new AppError(400, `Station with this passkey already exists`);
      }

      const userStations = allStationsCfg.getStationsByUser(owner);
      const count = userStations != null ? userStations.size : 0;
      if (count >= 3) {
        throw new AppError(400, `Max number of stations per user reached`);
      }

      const id = crypto.randomBytes(4).toString("hex");
      const station = {
        id,
        lat: latNum,
        lon: lonNum,
        owner,
        passkey,
        place: trimPlace,
        measurement: null,
        public: true,
        type,
      } as IStation;
      allStationsCfg.addStation(station);
      console.info("ADD station", id);

      res.status(200).json({ id });
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

export default router;
