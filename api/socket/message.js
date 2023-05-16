module.exports = function(io) {
    io.on('connection', (socket) => {
      const users = []
      console.log(`${socket.id} user just connected`)
      socket.on('message', ({ message, name, to }) => {
        io.emit(to, { message, name })
      })
    
      socket.on('disconnect', () => {
        console.log('a user disconnected')
      })
    })
}