import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  }
})

const User = mongoose.model('User', UserSchema)

export class GuessUserRepository {
  static create ({ username, password }) {
    // 1. Validate the form (Optional: zod)
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')

    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long')

    // 2. Check if the user already exists
    const user = User.findOne({ username })
    if (user) throw new Error('User already exists')

    const id = crypto.randomUUID()
  }

  static login ({ username, password }) {}
}
