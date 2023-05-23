let socketIO;

function emitProfileView(to) {
  socketIO.emit("ping");
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
}