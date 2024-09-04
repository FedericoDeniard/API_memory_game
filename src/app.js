const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { User } = require("./models/schemas");

mongoose.connect(process.env.MONGO_URI);

const { validateForm } = require("./controllers/functions");

const app = express();
const corsOptions = {
  origin: "https://federicodeniard.github.io",
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
};
app.use(cors(corsOptions));
app.use(express.json());

app.post("/leaderboard/new_record", async (req, res) => {
  try {
    const { id, username, time, date } = req.body;
    let form = { id, username, time, date };
    if (!validateForm(form)) {
      return res.status(400).send({ message: "Invalid form" });
    }

    let user = await User.findOne({ id });

    if (!user) {
      const user = new User({
        id,
        username,
        time,
        date,
      });
      const data = await user.save();
      res.status(201).send(data);
    } else {
      await User.findOneAndUpdate(
        { id },
        {
          $set: {
            time,
            date,
          },
        },
        { new: true }
      );

      res.status(200).send({ message: "Record updated" });
    }
  } catch (error) {
    console.error("Error saving record:", error);
    res.status(500).send(error);
  }
});

app.get("/top-leaderboard", async (req, res) => {
  try {
    const data = await User.find()
      .sort({ time: 1 })
      .limit(10)
      .select("id username time date");
    if (data.length === 0) {
      res.status(404).send({ message: "No records found" });
    }
    const processedData = data.map((user) => ({
      id: user.id.slice(-4),
      username: user.username,
      time: user.time,
      date: user.date,
    }));
    res.status(200).send(processedData);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/last-leaderboard", async (req, res) => {
  try {
    const data = await User.find()
      .sort({ date: -1 })
      .limit(10)
      .select("id username time date");
    if (data.length === 0) {
      res.status(404).send({ message: "No records found" });
    }
    const processedData = data.map((user) => ({
      id: user.id.slice(-4),
      username: user.username,
      time: user.time,
      date: user.date,
    }));
    res.status(200).send(processedData);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
module.exports = app;
