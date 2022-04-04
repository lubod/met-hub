import express from "express";
import { AddressInfo } from "net";
import router from "./router";
import SocketEmitter from "./socketEmitter";
import Agregator from "./agregator";

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// eslint-disable-next-line import/prefer-default-export
export const socketEmiter = new SocketEmitter();
const agregator = new Agregator(socketEmiter);
agregator.start();

app.use(express.static(__dirname));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(router);

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
