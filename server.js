const express = require('express')
const mongoose = require('mongoose')
const StatusCodes = require('http-status-codes')
const cookieParser = require('cookie-parser')
const ws = require('ws')
const User = require('./models/User')
const { hashedPassword, comparePassword } = require('./utils/passwordUtils')
const { UnauthenticatedError } = require('./errors/customErrors')
const {
  validateSignupInput,
  validateLoginInput,
} = require('./middlewares/validationMiddleware')
const { createJWT, verifyJWT } = require('./utils/tokenUtils')
const {
  errorHandlerMiddleware,
} = require('./middlewares/errorHandlerMiddleware')
const Message = require('./models/Message')
const path = require('path')
const app = express()
require('dotenv').config()
require('express-async-errors')

app.use(express.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'my-react-app/dist')))

app.get('/api/chatPage', (req, res, next) => {
  const { token } = req.cookies
  const data = verifyJWT(token)
  res.json(data)
})

app.get('/api/users', async (req, res, next) => {
  const users = await User.find({})
  // console.log(users)
  res.json({ users })
})

app.get('/api/messages/:userId', async (req, res) => {
  const { token } = req.cookies
  const data = verifyJWT(token)
  const messages = await Message.find({
    sender: { $in: [req.params.userId, data.userId] },
    recipient: { $in: [req.params.userId, data.userId] },
  })
  res.json(messages)
})

app.post('/api/auth/signup', validateSignupInput, async (req, res, next) => {
  req.body.password = await hashedPassword(req.body.password)
  const user = await User.create(req.body)
  res.status(201).json({ msg: 'successfully registered', user })
})

app.post('/api/auth/login', validateLoginInput, async (req, res, next) => {
  console.log('server')
  const username = req.body.username

  //check username
  const user = await User.findOne({ username })
  if (!user) throw new UnauthenticatedError('user not exsit')

  //check password
  const isMatch = await comparePassword(req.body.password, user.password)
  if (!isMatch) throw new UnauthenticatedError('wrong password')

  const token = createJWT({ userId: user._id, username: user.username })

  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  })

  res.status(StatusCodes.CREATED).json({ msg: 'user logged in', user: user })
})

app.post('/api/auth/logout', (req, res, next) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .json('ok')
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './my-react-app/dist', 'index.html'))
})
// NOT FOUND
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

// error router
app.use(errorHandlerMiddleware)

// Start the server

mongoose
  .connect(
    'mongodb+srv://Abdo_Salama:Abdo932001@cluster0.vimiyn8.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => console.log('conneced'))
const port = process.env.PORT || 5100
const server = app.listen(port, () => {
  console.log(`server running on PORT ${port}....`)
})

// create wss
const wss = new ws.Server({ server })
wss.on('connection', (connection, req) => {
  const notifyOnlinePeople = () =>
    wss.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            _id: c.userId,
            username: c.username,
          })),
        })
      )
    })

  connection.timer = setInterval(() => {
    connection.ping()
    connection.death = setTimeout(() => {
      clearInterval(connection.timer)
      connection.terminate()
      notifyOnlinePeople()
    }, 1000)
  }, 5000)

  connection.on('pong', () => {
    clearTimeout(connection.death)
  })

  // get user info and store it in the connection
  let token
  if (req.headers.cookie) {
    token = req.headers.cookie
      .split(';')
      .filter((cookie) => cookie.startsWith('token'))[0]
      .split('=')[1]
  }

  if (token) {
    const data = verifyJWT(token)
    if (data.userId || data.username) {
      connection.userId = data.userId
      connection.username = data.username
    }
  } else {
    throw new UnauthenticatedError('not login')
  }

  // handle message
  connection.on('message', async (message) => {
    const { recipient, text } = JSON.parse(message).message
    if (text && recipient) {
      const messageDoc = await Message.create({
        recipient,
        text,
        sender: connection.userId,
      })

      const data = [...wss.clients].filter(
        (client) => client.userId === recipient
      )

      data.forEach((client) => {
        client.send(
          JSON.stringify({
            recipient,
            text,
            sender: connection.userId,
            id: messageDoc._id,
          })
        )
      })
    }
  })

  // send online people
  notifyOnlinePeople()
})
