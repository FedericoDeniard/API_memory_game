const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { User } = require("./models/schemas");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(express.json());

const checkId = (id) => {
  let exist;
  if (User.findOne({ id })) {
    exist = true;
  } else {
    exist = false;
  }
  return exist;
};

app.post("/leaderboard/new_record", async (req, res) => {
  try {
    const { id, username, time, date } = req.body;

    if (checkId(id)) {
      let user = await User.findOne({ id });
      if (user.time < time) {
        await User.updateOne({ id }, { $set: { time, date } });
      } else {
        res.status(200).send({ message: "Record not beated" });
      }
    } else {
      const user = new User({
        id,
        username,
        time,
        date,
      });
      const data = await user.save();
      res.status(201).send(data);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
module.exports = app;
