import express from "express";
import { createClient } from "redis";
import { AddressInfo } from "net";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
// eslint-disable-next-line import/no-extraneous-dependencies
import cors from "cors";
import router from "./router";
import SocketEmitter from "./socketEmitter";
import Agregator from "./agregator";
import { AllStationsCfg } from "../common/allStationsCfg";
// import Go from "./go";

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const helmet = require("helmet");

const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export class AppError extends Error {
  code: number;

  msg: string;

  stack: string;

  constructor(code: number, msg: string, stack?: string) {
    super(msg);
    this.code = code;
    this.msg = msg;
    this.stack = stack;

    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line import/prefer-default-export
export const socketEmiter = new SocketEmitter();
// AllStationsCfg.writeCfg();
export const allStationsCfg = new AllStationsCfg();
allStationsCfg.readCfg().then(() => {
  const agregator = new Agregator(
    allStationsCfg.getMeasurements(),
  );
  agregator.start();
  // const go = new Go();
  // go.start();
});

app.use(helmet());
// app.use(compression());
app.use(cors());
app.use(express.static(__dirname));
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(limiter);

app.use(cookieParser());

app.use(express.json());

app.use((req: any, res: any, next: any) => {
  console.log(
    "ENDPOINT:",
    new Date(),
    req.path,
    req.cookies,
    req.body,
    req.query,
    req.params,
  );
  next();
});

app.use(router);

// eslint-disable-next-line no-unused-vars
app.use((err: AppError, req: any, res: any, next: any) => {
  console.error("ERROR:", err);
  res.status(err.code || 500).json({ code: err.code, msg: err.msg });
});

io.on("connection", (socket: any) => {
  console.log("a user connected", socket.id);
  socketEmiter.addSocket(socket);

  socket.on("disconnect", () => {
    socketEmiter.removeSocket(socket);
    console.log("A user disconnected", socket.id);
  });
});

const server = http.listen(8089, () => {
  // const server = http.listen(18080, () => {
  const { port } = server.address() as AddressInfo;

  console.log("Listening at http://%s:%s", "localhost", port);
});
