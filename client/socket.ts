import socketIOClient from "socket.io-client";

const ENV = process.env.ENV || "";

export default class Socket {
  socket: any;

  constructor() {
    let url = "/";

    if (ENV === "dev") {
      url = "http://localhost:18080/";
    }
    this.socket = socketIOClient(url);
    console.info("socket");
  }

  getSocket() {
    return this.socket;
  }
}
