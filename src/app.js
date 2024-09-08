import express from 'express'
import session from 'express-session'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import { Record } from './models/schemas.js'
import { checkNewRecord, validateForm, CustomError } from './controllers/functions.js'
import { UserRepository } from './controllers/users.js'
import jwt from 'jsonwebtoken'

dotenv.config()

mongoose.connect(process.env.MONGO_URI)

const app = express()
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://federicodeniard.github.io' : 'http://localhost:5173',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production', sameSite: 'lax' }
}))

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session.user = null
  try {
    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET)
      req.session.user = data
    }
  } catch (error) {}
  next()
})

app.post('/leaderboard/new_record', async (req, res) => {
  const user = req.session.user

  if (!user) {
    return res.status(403).send(new CustomError('Unauthorized', 'Not logged in'))
  }

  try {
    const { time, date } = req.body
    const form = { time, date }

    if (!validateForm(form)) {
      return res.status(400).send(new CustomError('ValidateError', 'Invalid form'))
    }

    const recordExists = await Record.findOne({ username: user.user })

    if (recordExists) {
      const isNewRecord = await checkNewRecord(time, user.user)

      if (isNewRecord) {
        await Record.findOneAndUpdate(
          { username: user.user },
          { $set: { time, date } },
          { new: true }
        )
        res.status(200).send({ message: 'Record updated' })
      } else {
        res.status(400).send(new CustomError('ValidateError', 'A best record already exists'))
      }
    } else {
      await Record.create({ username: user.user, time, date })
      res.status(200).send({ message: 'Record created' })
    }
  } catch (error) {
    res.status(500).send(new CustomError('InternalError', 'Something went wrong'))
  }
})

app.get('/top-leaderboard', async (req, res) => {
  try {
    const data = await Record.find()
      .sort({ time: 1 })
      .limit(10)
      .select('username time date')

    const processedData = data.map((user) => ({
      username: user.username,
      time: user.time,
      date: user.date
    }))

    return res.status(200).send(processedData)
  } catch (error) {
    return res.status(500).send(CustomError('InternalError', error.message))
  }
})

app.get('/last-leaderboard', async (req, res) => {
  try {
    const data = await Record.find()
      .sort({ date: -1 })
      .limit(10)
      .select('username time date')

    const processedData = data.map((user) => ({
      username: user.username,
      time: user.time,
      date: user.date
    }))
    return res.status(200).send(processedData)
  } catch (error) {
    return res.status(500).send(CustomError('InternalError', error.message))
  }
})

// Login

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user.id, user: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 1000 * 60 * 60 // 1 hora
      })
      .send(user)
  } catch (error) {
    return res.status(401).send(new CustomError('Unauthorized', error.message))
  }
})

app.post('/refresh-login', (req, res) => {
  const user = req.session.user

  if (!user) {
    return res.status(401).send(new CustomError('Unauthorized', 'Not logged in'))
  }

  return res.status(200).send({
    id: user.id,
    username: user.user
  })
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const _id = await UserRepository.create({ username, password })
    res.status(200).send({ id: _id })
  } catch (error) {
    res.status(400).json(new CustomError(error.name, error.message))
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('access_token').json({ message: 'Logged out' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server running on port ' + PORT))

export default app
