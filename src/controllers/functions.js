import { validate as validateUUID } from 'uuid'

const validateForm = (form) => {
  const isUUID = (id) => validateUUID(id)
  const isLength = (GuessUsername) => GuessUsername.length >= 4 && GuessUsername.length <= 10
  const isNumeric = (value) => !isNaN(value)
  const isGreaterThan = (value, min) => value > min
  const isRecentDate = (date, minutes) => {
    const now = Math.floor(Date.now() / 1000)
    return date >= now - minutes * 60
  }

  const checkId = isUUID(form.id)
  const checkGuessUsername = isLength(form.GuessUsername)
  const checkTime =
    isNumeric(form.time) && isGreaterThan(parseFloat(form.time), 10000)
  const checkDate =
    isNumeric(form.date) && isRecentDate(parseFloat(form.date), 5)
  let error
  if (!checkId) {
    error = new Error('Invalid id')
    console.log('Invalid id')
  }
  if (!checkGuessUsername) {
    error = new Error('Invalid GuessUsername')
    console.log(error)
  }
  if (!checkTime) {
    error = new Error('Invalid time')
    console.log(error)
  }
  if (!checkDate) {
    error = new Error('Invalid date')
    console.log(error)
  }

  return checkId && checkGuessUsername && checkTime && checkDate
}

export { validateForm }
