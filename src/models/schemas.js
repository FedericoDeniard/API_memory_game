import mongoose from 'mongoose'

const RecordSchema = new mongoose.Schema({
  id: String,
  username: String,
  time: Number,
  date: Number
})

const Record = mongoose.model('Record', RecordSchema)

export { Record }
