import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', UserSchema)

export class UserRepository {
  static async create ({ username, password }) {
    // 1. Validate the form (Optional: zod)
    Validation.username(username)
    Validation.password(password)

    // 2. Check if the user already exists
    const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
    if (user) throw new CustomError('ValidationError', 'User already exists')

    // 3. Hash the password
    const hasedPassword = await bcrypt.hash(password, 10)
    const newUser = await new User({ username, password: hasedPassword }).save()

    return newUser._id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = await User.findOne({ username })
    if (!user) throw new Error('User not found')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('Invalid password')

    const publicUser = { id: user._id, username: user.username }

    return publicUser
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new CustomError('ValidationError', 'Username must be a string')
    if (username.length < 3) throw new CustomError('ValidationError', 'Username must be at least 3 characters long')
    if (username.length > 10) throw new CustomError('ValidationError', 'Username must be at most 10 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new CustomError('ValidationCustomError', 'Password must be a string')
    if (password.length < 6) throw new Error('ValidationError', 'Password must be at least 6 characters long')
  }
}

export class CustomError extends Error {
  constructor (name, message) {
    super(message)
    this.name = name
  }
}
