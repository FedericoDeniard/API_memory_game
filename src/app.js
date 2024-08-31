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
const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
};
app.use(cors(corsOptions));
app.use(express.json());

const checkId = async (id) => {
  const user = await User.findOne({ id });
  let exists = user ? true : false;
  return exists;
};

app.post("/leaderboard/new_record", async (req, res) => {
  try {
    const { id, username, time, date } = req.body;

    let exists = await checkId(id);
    if (exists) {
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
    if (!data) {
      res.status(404).send({ message: "Data not found" });
    }
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
module.exports = app;
