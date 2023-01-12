const mongoose = require('mongoose');

const Rating = mongoose.model(
  'Rating',
  new mongoose.Schema({
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    upvote: {
      type: Boolean,
      required: true,
    },
  }),
  'ratings',
);

module.exports = Rating;
