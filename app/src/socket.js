import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL,{
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
