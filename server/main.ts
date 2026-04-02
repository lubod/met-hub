import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { AddressInfo } from "net";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import path from "path";
import router from "./router";
import Aggregator from "./aggregator";
import { AllStationsCfg } from "../common/allStationsCfg";
import redisClient from "./redisClient";

const app = express();
const helmet = require("helmet");
const csp = require("helmet-csp");

const publicDirectoryPath = path.join(__dirname, "html");

redisClient.connect().catch((err) => {
  console.error("Fatal: failed to connect to Redis:", err);
  process.exit(1);
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // max 1000 requests per 10 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
});

export class AppError extends Error {
  code: number;

  msg: string;

  constructor(code: number, msg: string, stack?: string) {
    super(msg);
    this.code = code;
    this.msg = msg;
    if (stack) {
      this.stack = stack;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export const allStationsCfg = new AllStationsCfg();
allStationsCfg.readCfg().then(() => {
  const aggregator = new Aggregator(allStationsCfg.getMeasurements());
  aggregator.start();
}).catch((err) => {
  console.error("Failed to read station config:", err);
});

app.use(helmet());
app.use(
  csp({
    directives: {
      defaultSrc: [`'self'`],
      scriptSrc: [`'self'`, `*.google.com`, `*.chatademian.com`],
      frameSrc: [`'self'`, `*.google.com`, `*.chatademian.com`],
      connectSrc: [`'self'`, `*.google.com`],
      imgSrc: [`'self'`, `*.openstreetmap.org`, `unpkg.com`],
      frameAncestors: [`'self'`, `*.chatademian.com`],
    },
  }),
);

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:8089";
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(publicDirectoryPath));

// Health check is before the rate limiter so it doesn't count against limits
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "html/index.html"));
});

app.use(router);

// eslint-disable-next-line no-unused-vars
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", err.code, err.msg);
  res.status(err.code || 500).json({ code: err.code, msg: err.msg });
});

const httpServer = http.createServer(app);
const server = httpServer.listen(8089, "0.0.0.0", () => {
  const addr = server.address() as AddressInfo;
  console.log("Listening at ", addr);
});
