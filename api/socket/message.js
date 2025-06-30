const { addNotifViews, addNotifLike , addNotifMessages} = require("../common/route_utils");

let socketIO;

function emitConnexion(profileId, status){
  socketIO.emit(`newConnexion`,{profileId, status});
}


function emitProfileView(to, from) {
  socketIO.emit(`view${to}`,{from});
  addNotifViews(from, to)
}

function emitProfileLike(to, from) {
  socketIO.emit(`like${to}`,{from});
  addNotifLike(from, to)
}

function emitProfileMessage(to, from, message) {
  socketIO.emit(`messages${to}`,{from, message});
  addNotifMessages(from, to)
}

function emitProfileMatch(to, from) {
  socketIO.emit(`match${to}`,{from});
  socketIO.emit(`match${from}`,{"from":to});
  console.log("maaaaaaaaaaaaaaaaaaaaaaaaatch")
  emitProfileMessage(from, to, "nouveau match")
  emitProfileMessage(to, from, "nouveau match")
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
  emitProfileMessage,
  // emitSession,
  emitConnexion
}