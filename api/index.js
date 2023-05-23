const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const filterRouter = require("./routes/filter");
const likeRouter = require("./routes/like");
const unlikeRouter = require("./routes/unlike");
const profileRouter = require("./routes/profile");
const blockedRouter = require("./routes/blocked");
const viewsRouter = require("./routes/views");
const testRouter = require("./routes/test");

require('dotenv').config()

const app = express();

// Middleware
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);
app.use("/api/user/chat", chatRouter);
app.use("/api/user/filtre", filterRouter);
app.use("/api/user/like", likeRouter);
app.use("/api/user/unlike", unlikeRouter);
app.use("/api/user/profile", profileRouter);
app.use("/api/user/blocked", blockedRouter);
app.use("/api/user/views", viewsRouter);
app.use("/api/test", testRouter);

const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

const { emitProfileView } = require("./socket/message")(io);

app.get('*', (req, res) => {
  return res.status(404).json({ message: 'Page not found' })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})