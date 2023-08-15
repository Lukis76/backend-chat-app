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
    socket.ro

    console.log('A user connected', socket.id)

    socket.on('message', (data) => {
        console.log('🚀 ~ file: index.js:22 ~ socket.on ~ data:', data)
        socket.broadcast.emit('message', {
            body: data,
            from: socket.id,
        })
        // io.emit('message', data)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})

server.listen(4000, () => {
    console.log('Server is running on port 4000')
})
