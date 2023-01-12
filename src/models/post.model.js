const mongoose = require('mongoose');

const Post = mongoose.model(
  'Post',
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 20,
    },
    desc: {
      type: String,
      minLength: 5,
      maxLength: 140,
    },
    url: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    views: {
      type: Number,
      default: 0
    }
  }),
  'posts',
);

module.exports = Post;
