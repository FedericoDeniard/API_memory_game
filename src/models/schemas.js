import mongoose from 'mongoose'

const GuessUserRecord = new mongoose.Schema({
  id: String,
  GuessUsername: String,
  time: Number,
  date: Number
})

const GuessUser = mongoose.model('GuessUser', GuessUserRecord)

export { GuessUser }
