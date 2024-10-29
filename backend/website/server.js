const express = require('express')
const http = require('http')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const { Server } = require('socket.io')
const cors = require('cors')
const path = require('path')

dotenv.config()
connectDB()
const app = express()
const server = http.createServer(app)

app.use(
  cors({
    origin: '*'
  })
)

app.use(express.json()) // to accept json data

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

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

// Error Handling middlewares
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

server.listen(PORT, console.log(`Server running on PORT ${PORT}...`.yellow.bold))
