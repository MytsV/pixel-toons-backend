const mongoose = require('mongoose');

const userData = new mongoose.Schema({
  biography: {
    type: String,
    minLength: 5,
    maxLength: 140,
  },
  avatarUrl: {
    type: String,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      //Matches any email address
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    joinDate: {
      type: Date,
      required: true,
    },
    data: userData,
  }),
  'users',
);

module.exports = User;
