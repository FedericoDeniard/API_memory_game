import { Record } from '../models/schemas.js'
import { CustomError } from './login.js'

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
