import { createContext } from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect(process.env.REACT_APP_SOCKET_IO_URL);
export const SocketContext = createContext();
