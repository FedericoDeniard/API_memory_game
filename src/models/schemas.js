import mongoose from 'mongoose'

const RecordSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  time: { type: Number, required: true },
  date: { type: Number, required: true }
})

const Record = mongoose.model('Record', RecordSchema)

export { Record }
