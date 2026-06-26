import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { StationType } from "../common/stationType";
import { createToken, verifyToken } from "./utils";
import redisClient from "./redisClient";
import { allStationsCfg, AppError } from "./state";
import { dom } from "./dom";
import { IMeasurement } from "./measurement";
import { loadData, loadRainData } from "./db";
import { getForecast, getAstronomicalData } from "./forecast";
import { IStation } from "../common/allStationsCfg";

const clientOAuth = new OAuth2Client(process.env.CLIENT_ID);

const DOM_PASSKEY = process.env.DOM_PASSKEY || (process.env.ENV !== "prod" ? "dev-dom-passkey" : undefined);
if (!DOM_PASSKEY) {
  throw new Error("DOM_PASSKEY environment variable is not set");
}
const router = express.Router();

interface IUser {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

const DOM_ACCESS_EMAIL = "lubo.drobny@gmail.com";

// Cache admin ID promise for 60 seconds to avoid a Redis fetch on every request
let adminIdPromise: Promise<string | null> | null = null;
let adminCacheExpiry = 0;

function getAdminId(): Promise<string | null> {
  if (process.env.NODE_ENV === "test") {
    return redisClient.hGet("USERS", "admin").then((val) => val ?? null);
  }
  const now = Date.now();
  if (adminIdPromise !== null && now < adminCacheExpiry) {
    return adminIdPromise;
  }
  adminCacheExpiry = now + 60_000;
  adminIdPromise = redisClient.hGet("USERS", "admin")
    .then((val) => val ?? null)
    .catch((err) => {
      adminIdPromise = null;
      adminCacheExpiry = 0;
      throw err;
    });
  return adminIdPromise;
}

async function checkAuth(
  req: Request,
  silent: boolean = false,
): Promise<IUser | null> {
  if (req.cookies.jwt) {
    const decoded = verifyToken(req.cookies.jwt);
    if (decoded != null && decoded.id != null) {
      const raw = await redisClient.hGet("USERS", decoded.id);
      if (raw != null) {
        let payload: {
          given_name?: string;
          family_name?: string;
          email?: string;
        } | null = null;
        try {
          payload = JSON.parse(raw);
        } catch (err) {
          if (err instanceof SyntaxError) {
            throw new AppError(500, "Corrupted session data in USERS store");
          }
          throw err;
        }
        if (payload != null) {
          return {
            id: decoded.id,
            given_name: payload.given_name ?? "",
            family_name: payload.family_name ?? "",
            email: payload.email ?? "",
            createdAt: (decoded.iat ?? 0) * 1000,
            expiresAt: (decoded.exp ?? 0) * 1000,
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
  if (stationID !== "dom" && allStationsCfg.getStationByID(stationID) == null) {
    throw new AppError(400, "Invalid params");
  }
  if (user != null) {
    const admin = await getAdminId();
    if (user.id === admin) {
      return;
    }
    if (
      stationID === "dom" &&
      user.email.toLowerCase() === DOM_ACCESS_EMAIL.toLowerCase()
    ) {
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

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

function catchAsync(fnc: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    fnc(req, res, next).catch(next);
  };
}

const authMiddleware: RequestHandler = catchAsync(async (req, res, next) => {
  const user = await checkAuth(req, true);
  req.user = user;
  next();
});

const requireAuthMiddleware: RequestHandler = catchAsync(async (req, res, next) => {
  const user = await checkAuth(req, false);
  req.user = user;
  next();
});

const accessMiddleware = (
  getStationID: (req: Request) => string | undefined,
  ownerOnly: boolean = false,
): RequestHandler => {
  return catchAsync(async (req, res, next) => {
    const stationID = getStationID(req);
    if (!stationID) {
      throw new AppError(400, "Invalid params");
    }
    await checkAccess(req.user ?? null, stationID, ownerOnly);
    next();
  });
};

// SSE

export const clients = new Map<number, Response>();
export const MAX_SSE_CONNECTIONS = 100;
let lastEventTime = 0;
let nextClientId = 1;

export const writeEvent = (data: string, type: "raw" | "ping" | "minute") => {
  if (type === "ping" && Date.now() - lastEventTime < 30000) {
    return;
  }
  for (const [id, res] of clients) {
    try {
      if (!res.writable || res.destroyed) {
        console.info(`${id} SSE not writable, removing client`);
        clients.delete(id);
        try {
          res.end();
        } catch {}
        continue;
      }
      const ok = res.write(`data: ${data}:${type}\n\n`, (err) => {
        if (err) {
          console.info(`${id} SSE write callback failed, removing client`);
          clients.delete(id);
          try {
            res.end();
          } catch {}
        }
      });
      if (!ok) {
        if (res.destroyed || !res.writable) {
          console.info(`${id} SSE write returned false and socket destroyed/not writable, removing client`);
          clients.delete(id);
          try {
            res.end();
          } catch {}
        }
      }
    } catch (err) {
      console.info(`${id} SSE write failed synchronously, removing client`, err);
      clients.delete(id);
      try {
        res.end();
      } catch {}
    }
  }
  lastEventTime = Date.now();
};

setInterval(() => writeEvent("-", "ping"), 30000);

function eventHandler(req: Request, res: Response) {
  if (clients.size >= MAX_SSE_CONNECTIONS) {
    const oldestId = clients.keys().next().value;
    if (oldestId !== undefined) {
      console.info(`Max SSE connections reached (${MAX_SSE_CONNECTIONS}). Evicting oldest client ${oldestId}`);
      const oldestRes = clients.get(oldestId);
      if (oldestRes) {
        try {
          oldestRes.write(`data: disconnected:max_connections\n\n`);
          oldestRes.end();
        } catch (e) {
          console.error(`Error ending evicted client ${oldestId}`, e);
        }
      }
      clients.delete(oldestId);
    }
  }

  res.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });

  const clientId = nextClientId;
  nextClientId += 1;
  clients.set(clientId, res);
  console.info(`${clientId} Connection opened`);

  // Set socket idle timeout (e.g. 60 seconds)
  req.socket.setTimeout(60000);
  req.socket.on("timeout", () => {
    console.info(`${clientId} SSE connection idle timeout`);
    clients.delete(clientId);
    try {
      res.end();
    } catch {}
  });

  const cleanUp = () => {
    console.info(`${clientId} Connection closed/finished`);
    clients.delete(clientId);
  };

  req.on("close", cleanUp);
  res.on("close", cleanUp);
  res.on("finish", cleanUp);
  res.on("error", (err) => {
    console.warn(`${clientId} SSE response error`, err);
    cleanUp();
  });
}

router.get(
  "/events",
  catchAsync(async (req: Request, res: Response) => {
    if (req.headers.accept === "text/event-stream") {
      eventHandler(req, res);
    } else {
      res.json({ message: "Ok" });
    }
  }),
);

// LAST DATA

router.get(
  "/api/getLastData/station/:stationID",
  authMiddleware,
  accessMiddleware((req) => req.params.stationID),
  catchAsync(async (req, res) => {
    const station = allStationsCfg.getStationByID(req.params.stationID);
    if (station != null) {
      const reply = await redisClient.get(station.measurement.getRedisLastDataKey());
      res.status(200).json(reply != null ? JSON.parse(reply) : null);
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/getLastData/dom",
  authMiddleware,
  accessMiddleware(() => "dom"),
  catchAsync(async (req, res) => {
    const reply = await redisClient.get(dom.getRedisLastDataKey());
    res.status(200).json(reply != null ? JSON.parse(reply) : null);
  }),
);

// TREND DATA

router.get(
  "/api/getTrendData/station/:stationID",
  authMiddleware,
  accessMiddleware((req) => req.params.stationID),
  catchAsync(async (req, res) => {
    const station = allStationsCfg.getStationByID(req.params.stationID);
    if (station != null) {
      const now = Date.now();
      const reply = await redisClient.zRangeByScore(
        station.measurement.getRedisTrendKey(),
        now - 3600000,
        now,
      );
      res
        .status(200)
        .json(
          reply.length > 0 ? station.measurement.transformTrendData(reply) : null,
        );
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

router.get(
  "/api/getTrendData/dom",
  authMiddleware,
  accessMiddleware(() => "dom"),
  catchAsync(async (req, res) => {
    const now = Date.now();
    const reply = await redisClient.zRangeByScore(
      dom.getRedisTrendKey(),
      now - 3600000,
      now,
    );
    res
      .status(200)
      .json(reply.length > 0 ? dom.transformTrendData(reply) : null);
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
    if (payload == null) {
      throw new AppError(401, "Invalid token payload");
    }
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
        sameSite: "lax",
      })
      .status(200)
      .json({
        id: payload.sub,
        given_name: payload.given_name,
        family_name: payload.family_name,
        email: payload.email ?? "",
        createdAt,
        expiresAt,
      } as IUser);
  }),
);

router.get(
  "/api/getUserProfile",
  authMiddleware,
  catchAsync(async (req, res) => {
    const user = req.user ?? null;
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
  authMiddleware,
  catchAsync(async (req, res) => {
    const user = req.user ?? null;
    const result: Array<Partial<IStation>> = [];

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

    const admin = user != null ? await getAdminId() : null;
    for (const sid of rs) {
      const station = allStationsCfg.getStationByID(sid);
      if (station == null) continue;
      const isOwner = user != null && user.id === station.owner;
      const isAdmin = user != null && user.id === admin;
      const item: Partial<IStation> = {
        id: station.id,
        lat: station.lat,
        lon: station.lon,
        place: station.place,
        type: station.type,
        public: station.public,
      };
      if (isOwner || isAdmin) {
        item.owner = station.owner;
      }
      result.push(item);
    }

    if (user != null && user.email.toLowerCase() === DOM_ACCESS_EMAIL) {
      result.push({
        id: "dom",
        lat: 0,
        lon: 0,
        type: StationType.Dom,
        place: "Dom",
        passkey: "",
        public: false,
        owner: user.id,
      });
    }

    res.status(200).json(result);
  }),
);

// LOAD

router.get(
  "/api/loadData",
  authMiddleware,
  accessMiddleware((req) => req.query.stationID as string),
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
      const { measurement, stationID } = req.query as {
        measurement: string;
        stationID: string;
      };
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
  authMiddleware,
  accessMiddleware((req) => req.params.stationID),
  catchAsync(async (req, res) => {
    const { stationID } = req.params;
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
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
      ) {
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
    if (
      req.query.lat != null &&
      req.query.lon != null &&
      req.query.date != null
    ) {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
      ) {
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
    const passkey = req.query.PASSKEY || req.body.PASSKEY || req.headers["x-passkey"];
    if (passkey !== DOM_PASSKEY) {
      throw new AppError(401, "Unauthorized: Invalid DOM_PASSKEY");
    }
    const data = req.body;
    const { date, decoded } = dom.decodeData(data, "Dom");
    const now = Date.now();
    const diff = now - date.getTime();
    if (diff >= 3600000) {
      throw new AppError(400, `Old data ${date}`);
    }
    await redisClient
      .multi()
      .set(dom.getRedisLastDataKey(), JSON.stringify(decoded))
      .zAdd(dom.getRedisRawDataKey(), {
        score: date.getTime(),
        value: JSON.stringify(decoded),
      })
      .exec();
    writeEvent(dom.getStationID(), "raw");
    res.sendStatus(200);
  }),
);

// add station
router.post(
  "/api/addStation",
  requireAuthMiddleware,
  catchAsync(async (req, res) => {
    if (
      req.body.lat != null &&
      req.body.lon != null &&
      req.body.place != null &&
      req.body.type != null
    ) {
      const user = req.user!;

      const { lat, lon, place, passkey, type } = req.body;

      if (type !== StationType.GoGenMe3900) {
        throw new AppError(400, `Unknown station type ${type}`);
      }

      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      if (
        !Number.isFinite(latNum) ||
        !Number.isFinite(lonNum) ||
        latNum < -90 ||
        latNum > 90 ||
        lonNum < -180 ||
        lonNum > 180
      ) {
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
      const station: Omit<IStation, "measurement"> = {
        id,
        lat: latNum,
        lon: lonNum,
        owner,
        passkey,
        place: trimPlace,
        public: true,
        type,
      };
      allStationsCfg.addStation(station);
      console.info("ADD station", id);

      res.status(200).json({ id });
    } else {
      throw new AppError(400, "Invalid params");
    }
  }),
);

export default router;
