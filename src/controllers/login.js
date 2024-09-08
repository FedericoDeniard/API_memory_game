import bcrypt from 'bcrypt'
import { CustomError, Validation } from './functions.js'
import { User } from '../models/schemas.js'

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
    if (!user) throw new CustomError('ValidationError', 'User not found')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new CustomError('ValidationError', 'Invalid password')

    const publicUser = { id: user._id, username: user.username }

    return publicUser
  }
}
