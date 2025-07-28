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
router.get("/user", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
    });
    return res.status(200).json({ message: "User found", user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);
  return res.status(200).json({ message: "Login successful", user });
});

module.exports = router;
