const { model } = require("mongoose");
const userSchema = require("../schemas/user.schema");

const User = model("User", userSchema);

module.exports = User;
