const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

router.get("/user", AuthController.getUser);

module.exports = router;
