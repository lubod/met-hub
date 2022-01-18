class SocketEmitter {
  sockets: any[] = [];

  addSocket = (socket: any) => {
    this.sockets.push(socket);
    console.info("sockets", this.sockets.length);
  };

  removeSocket = (socket: any) => {
    const index = this.sockets.indexOf(socket);
    if (index > -1) {
      this.sockets.splice(index, 1);
    }
    console.info("sockets", this.sockets.length);
  };

  emit = (channel: string, data: any) => {
    this.sockets.forEach((socket) => {
      socket.emit(channel, data);
      console.log("emit", channel, socket.id);
    });
  };
}

export default SocketEmitter;
