const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const { Server } = require('socket.io')
const cors = require('cors')
const path = require('path')

dotenv.config()
const app = express()
const server = http.createServer(app)

app.use(
  cors({
    origin: '*'
  })
)

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    // origin: 'http://localhost:3000'
    origin: '*'
    // credentials: true
  }
})

app.use(express.json()) // to accept json data

// --------------------------deployment------------------------------

const __dirname1 = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/frontend/build')))

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html')))
} else {
  app.get('/', (req, res) => {
    res.send('API is running..')
  })
}

// --------------------------deployment------------------------------

const PORT = process.env.PORT

io.on('connection', (socket) => {
  console.log('Connected to socket.io')
  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log('User Joined Room: ' + room)
  })
  socket.on('typing', (room) => socket.in(room).emit('typing'))
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat

    if (!chat.users) return console.log('chat.users not defined')

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return

      socket.in(user._id).emit('message recieved', newMessageRecieved)
    })
  })
  socket.on('new user join chat', (newUserJoinedChatData) => {
    const { sender, chat } = newUserJoinedChatData

    chat.users.forEach((user) => {
      if (user._id == newUserJoinedChatData.sender._id) {
        socket.in(user._id).emit('new user join chat - message recieved', {
          ...newUserJoinedChatData,
          content: `you has joined the group chat "${chat.chatName}"`,
          isNotification: true
        })
      } else {
        socket.in(user._id).emit('new user join chat - message recieved', {
          ...newUserJoinedChatData,
          content: `${sender.name} has joined the group chat "${chat.chatName}"`,
          isNotification: true
        })
      }
    })
  })

  socket.off('setup', () => {
    console.log('USER DISCONNECTED')
    // eslint-disable-next-line no-undef
    socket.leave(userData._id)
  })
})

server.listen(PORT, console.log(`Server running on PORT ${PORT}...`))
