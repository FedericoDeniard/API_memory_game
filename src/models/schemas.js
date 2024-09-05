const mongoose = require("mongoose");

const UserRecord = new mongoose.Schema({
  id: String,
  username: String,
  time: Number,
  date: Number,
});

const User = mongoose.model("GuessUser", UserRecord);
module.exports = { User };
