import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'

const app = express()
app.use(cors())

const server = createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
})
app.use(morgan('dev'))

io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room)
  })

  socket.on('message', (data) => {
    const message = {
      body: data,
      from: socket.id,
    }

    io.to(data.room).emit('message', message)

    socket.broadcast.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

server.listen(4000, () => {
  console.log('Server is running on port 4000')
})
