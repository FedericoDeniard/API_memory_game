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
  let error

  if (!checkTime) {
    error = new Error('Invalid time')
    console.log(error)
  }
  if (!checkDate) {
    error = new Error('Invalid date')
    console.log(error)
  }

  return checkTime && checkDate
}

export { validateForm }

export const checkNewRecord = async (time, id) => {
  console.log('El id a buscar es: ', id)
  const user = await Record.findOne({ id })
  let isNewRecord = false
  if (user.time > time) {
    isNewRecord = true
  }
  return isNewRecord
}
