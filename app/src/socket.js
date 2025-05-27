import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io("ws://localhost:3000", { autoConnect: false }, {transports: ['websocket']});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
