import mongoose from 'mongoose'

const RecordSchema = new mongoose.Schema({
  username: { type: String, required: true },
  time: { type: Number, required: true },
  date: { type: Number, required: true }
})

const Record = mongoose.model('Record', RecordSchema)

export { Record }
