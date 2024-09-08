import { Record } from '../models/schemas.js'

const validateForm = (form) => {
  const isNumeric = (value) => !isNaN(value)
  const isGreaterThan = (value, min) => value > min
  const isRecentDate = (date, minutes) => {
    const now = Math.floor(Date.now() / 1000)
    return date >= now - minutes * 60
  }

  const checkTime =
    isNumeric(form.time) && isGreaterThan(parseFloat(form.time), 10000)
  const checkDate =
    isNumeric(form.date) && isRecentDate(parseFloat(form.date), 5)

  if (!checkTime) {
    throw new CustomError('ValidateError', 'Invalid time')
  }
  if (!checkDate) {
    throw new CustomError('ValidateError', 'Invalid date')
  }

  return checkTime && checkDate
}

export { validateForm }

export const checkNewRecord = async (time, username) => {
  const user = await Record.findOne({ username })
  let isNewRecord = false
  if (user.time > time) {
    isNewRecord = true
  }
  return isNewRecord
}

export class CustomError extends Error {
  constructor (name, message) {
    super(message)
    this.name = name
  }
}

export class Validation {
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
