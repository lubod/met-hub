import express from "express";
import { AddressInfo } from "net";
import cookieParser from "cookie-parser";
import router from "./router";
import SocketEmitter from "./socketEmitter";
import Agregator from "./agregator";
import { AllStationsCfg } from "../common/allStationsCfg";
// import Go from "./go";

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

export class AppError {
  code: number;

  msg: string;

  stack: string;

  constructor(code: number, msg: string, stack?: string) {
    this.code = code;
    this.msg = msg;
    this.stack = stack;
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
  // go.select();
});

app.use(express.static(__dirname));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

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

const server = http.listen(8082, () => {
  const { port } = server.address() as AddressInfo;

  console.log("Listening at http://%s:%s", "localhost", port);
});
