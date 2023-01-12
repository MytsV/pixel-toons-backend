const sendMsg = require("../middleware/message_builder");
const {validateToken} = require("../middleware");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Rating = require("../models/rating.model");

const getPost = async (req, res) => {
  if (!req.query.postId) {
    sendMsg(res, 'post_id_missing', 422);
    return;
  }

  let post;
  try {
    post = await Post.findOne({ _id: req.query.postId });
  } catch (err) {
    sendMsg(res, 'post_not_found', 404);
    return;
  }
  if (!post) {
    sendMsg(res, 'post_not_found', 404);
    return;
  }

  return post;
};

const getData = async (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;

  const user = await User.findOne({ _id: req.userId });
  if (!user) {
    sendMsg(res, 'user_not_found', 404);
    return;
  }

  const post = await getPost(req, res);
  if (!post) return;

  return { post, user };
};

const addRating = (upvote) => async (req, res) => {
  const data = await getData(req, res);
  if (!data) return;
  const { user, post } = data;

  const filter = {
    userId: user._id,
    postId: post._id,
  };
  if (Rating.exists(filter)) {
    await Rating.deleteMany(filter);
  }

  const rating = new Rating({
    userId: user._id,
    postId: post._id,
    upvote: upvote
  });

  rating.save((err, _) => {
    if (err !== null) {
      sendMsg(res, 'server_error', 500);
    } else {
      sendMsg(res, 'successfully_created');
    }
  });
};

const getRatingByUser = async (req, res) => {
  const data = await getData(req, res);
  if (!data) return;
  const { user, post } = data;

  if(!user._id.equals(req.query.userId)) return sendMsg(res, 'forbidden', 403);

  const rating = await Rating.findOne({
    userId: user._id,
    postId: post._id,
  });
  if (!rating) return sendMsg(res, 'rating_not_found', 404);

  res.send({
    upvote: rating.upvote
  });
};

const getRatingSum = async (req, res) => {
  const post = await getPost(req, res);
  if (!post) return;

  const ratings = await Rating.find({
    postId: post._id,
  });

  const positive = ratings.reduce((acc, cur) => acc + cur.upvote, 0);
  const rating = positive - (ratings.length - positive);

  res.send({
    rating: rating
  });
};

const getRating = async (req, res) => {
  if (req.query.userId) return getRatingByUser(req, res);
  return getRatingSum(req, res);
};

module.exports = {addRating, getRating};
