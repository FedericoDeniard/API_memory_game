import mongoose from 'mongoose'

const RecordSchema = new mongoose.Schema({
  username: { type: String, required: true },
  time: { type: Number, required: true },
  date: { type: Number, required: true }
})

export const Record = mongoose.model('Record', RecordSchema)

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

export const User = mongoose.model('User', UserSchema)
