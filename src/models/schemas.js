const mongoose = require("mongoose");

const UserRecord = new mongoose.Schema({
  id: Number,
  username: String,
  time: Number,
  date: Date,
});

const User = mongoose.model("User", UserRecord);
module.exports = { User };
