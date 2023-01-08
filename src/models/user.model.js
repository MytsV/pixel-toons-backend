const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 20,
      unique: true
    },
    email: {
      type: String,
      required: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
  }),
  'users'
);

module.exports = User;
