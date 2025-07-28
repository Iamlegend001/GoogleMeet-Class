const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes"); // Correct path

const app = express();
app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use("/auth", authRoutes);

module.exports = app;
