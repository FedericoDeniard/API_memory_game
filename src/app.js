import express from 'express'
import session from 'express-session'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import { GuessUser } from './models/schemas.js'
import { validateForm } from './controllers/functions.js'
import { GuessUserRepository } from './controllers/login.js'
import jwt from 'jsonwebtoken'

dotenv.config()

mongoose.connect(process.env.MONGO_URI)

const app = express()
const corsOptions = {
  origin: 'https://federicodeniard.github.io',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type'
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}))

app.use((req, res, next) => {
  const token = req.cookies.access_token

  req.session.user = null
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.session.user = data
  } catch {
  } next()
})

app.set('view engine', 'ejs')

app.post('/leaderboard/new_record', async (req, res) => {
  try {
    const { id, username, time, date } = req.body
    const form = { id, username, time, date }
    if (!validateForm(form)) {
      return res.status(400).send({ message: 'Invalid form' })
    }

    const user = await GuessUser.findOne({ id })

    if (!user) {
      const newUser = new GuessUser({
        id,
        username,
        time,
        date
      })
      const data = await newUser.save()
      res.status(201).send(data)
    } else {
      await GuessUser.findOneAndUpdate(
        { id },
        {
          $set: {
            time,
            date
          }
        },
        { new: true }
      )

      res.status(200).send({ message: 'Record updated' })
    }
  } catch (error) {
    console.error('Error saving record:', error)
    res.status(500).send(error)
  }
})

app.get('/top-leaderboard', async (req, res) => {
  try {
    const data = await GuessUser.find()
      .sort({ time: 1 })
      .limit(10)
      .select('id username time date')
    if (data.length === 0) {
      res.status(404).send({ message: 'No records found' })
    }
    const processedData = data.map((user) => ({
      id: user.id.slice(-4),
      username: user.username,
      time: user.time,
      date: user.date
    }))
    res.status(200).send(processedData)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get('/last-leaderboard', async (req, res) => {
  try {
    const data = await GuessUser.find()
      .sort({ date: -1 })
      .limit(10)
      .select('id username time date')
    if (data.length === 0) {
      res.status(404).send({ message: 'No records found' })
    }
    const processedData = data.map((user) => ({
      id: user.id.slice(-4),
      username: user.username,
      time: user.time,
      date: user.date
    }))
    res.status(200).send(processedData)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Login

app.get('/a', (req, res) => {
  const user = req.session.user
  res.render('index', { user })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await GuessUserRepository.login({ username, password })
    const token = jwt.sign({ id: user.id, user: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 // 1 hora
      })
      .send(user)
  } catch (error) {
    res.status(401).send(error.message) // TODO This can give too much information
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const id = await GuessUserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message) // TODO This can give too much information
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('access_token').json({ message: 'Logged out' })
})

app.get('/protected', (req, res) => {
  const user = req.session.user
  if (!user) {
    return res.status(403).send('Unauthorized')
  }
  res.render('protected', { user })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server running on port ' + PORT))

export default app
