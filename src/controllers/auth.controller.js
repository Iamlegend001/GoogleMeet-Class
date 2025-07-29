const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, password } = req.body;

  const isUserAllReadyExist = await User.findOne({ username });

  if (isUserAllReadyExist) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({ username, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "lax", // Recommended for security and compatibility
  });

  res.status(201).json({ message: "User registered successfully", user });
}

async function getUser(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: payload.id });

    return res.status(200).json({ message: "User found", user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function login(req, res) {
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

  res.cookie("token", token, {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "lax", // Recommended for security and compatibility
  });

  return res.status(200).json({ message: "Login successful", user });
}

function logout(_, res) {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
}

module.exports = { register, getUser, login, logout };
