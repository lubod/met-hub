import socketIOClient from 'socket.io-client';

export default class Socket {
    socket: any;

    constructor() {
        this.socket = socketIOClient('/');
        console.info('socket');
    }

    getSocket() {
        return this.socket;
    }
}
