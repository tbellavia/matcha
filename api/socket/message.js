const { addNotifViews, addNotifLike , addNotifMessages} = require("../common/route_utils");

let socketIO;

function emitProfileView(to, from) {
  socketIO.emit(`view${to}`,{from});
  addNotifViews(from, to)
}

function emitProfileLike(to, from) {
  socketIO.emit(`like${to}`,{from});
  addNotifLike(from, to)
}

function emitProfileMatch(to, from) {
  socketIO.emit(`match${to}`,{from});
  socketIO.emit(`match${from}`,{"from":to});
  addNotifMessages(from, to)
  addNotifMessages(to, from)
}

function emitProfileMessage(to, from) {
  socketIO.emit(`messages${to}`,{from});
  addNotifMessages(from, to)
}

function emitProfileUnlike(to, from) {
  socketIO.emit(`unlike${to}`,{from});
}

module.exports = {
  init: (io) => { 
    socketIO = io;

    socketIO.on('connection', (socket) => {
      const users = []
      console.log(`${socket.id} user just connected`)
    
      socket.on('message', ({ message, name, to }) => {
        socketIO.emit(to, { message, name })
      })

      socket.on('disconnect', () => {
        console.log('a user disconnected')
      })
    })
  },
  // Utils function
  emitProfileView,
  emitProfileLike,
  emitProfileMatch,
  emitProfileUnlike,
  emitProfileMessage
}