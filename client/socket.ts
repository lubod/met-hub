import socketIOClient from "socket.io-client";

export default class Socket {
  socket: any;

  constructor(test:boolean = false) {
    let url = "/";

    if (test) {
      url = "http://localhost:18080/";
    }
    this.socket = socketIOClient(url);
    console.info("socket", url);
  }

  getSocket() {
    return this.socket;
  }
}
