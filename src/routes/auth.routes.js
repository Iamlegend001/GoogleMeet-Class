const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const isUserAllReadyExist = await User.findOne({ username });
  if (isUserAllReadyExist) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({ username, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);

  res.status(201).json({ message: "User registered successfully", user });
});
router.get('/user', async (req, res) => {})
module.exports = router;
