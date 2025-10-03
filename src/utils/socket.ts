import { io, Socket } from "socket.io-client";

const SOCKET_URL: string = `https://lms-node-backend-v1.onrender.com`;

const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

export default socket;