import express from "express";
import { createClient } from "redis";
import { AddressInfo } from "net";
import router from "./router";
import SocketEmitter from "./socketEmitter";
import Agregator from "./agregator";
import { AllStationsCfg } from "../common/allStationsCfg";
// import Go from "./go";

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

export class AppError extends Error {
  code: number;

  msg: string;

  stack: string;

  constructor(code: number, msg: string, stack?: string) {
    super(msg);
    this.code = code;
    this.msg = msg;
    this.stack = stack;

    Error.captureStackTrace(this, this.constructor)
  }
}

// eslint-disable-next-line import/prefer-default-export
export const socketEmiter = new SocketEmitter();
// AllStationsCfg.writeCfg();
export const allStationsCfg = new AllStationsCfg();
allStationsCfg.readCfg().then(() => {
  const agregator = new Agregator(
    socketEmiter,
    allStationsCfg.getMeasurements()
  );
  agregator.start();
  // const go = new Go();
  // go.start();
});

app.use(express.static(__dirname));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(cookieParser());

app.use(express.json());

app.use((req: any, res: any, next: any) => {
  console.log("ENDPOINT:", req.path);
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
