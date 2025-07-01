import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL,{autoConnect: false,transports: ["websocket"]});

socket.onAny((event, ...args) => {});

export default socket;
