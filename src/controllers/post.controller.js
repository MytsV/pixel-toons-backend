const Post = require('../models/post.model');
const { validateToken } = require('../middleware');
const User = require('../models/user.model');
const sendMsg = require('../middleware/message_builder');

const createPost = async (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;

  const user = await User.findOne({ _id: req.userId });
  if (!user) return sendMsg(res, 'user_not_found', 404);

  const post = new Post({
    userId: req.userId,
    name: req.body.name,
    desc: req.body.desc,
    url: req.body.url,
    date: new Date()
  });

  post.save((err, _) => {
    if (err !== null) {
      // 422 Unprocessable Entity
      sendMsg(res, err.message, 422);
    } else {
      sendMsg(res, 'successfully_created');
    }
  });
};

const PER_PAGE = 10;

const getAllPosts = async (req, res) => {
  const filter = {};
  if (req.query.userId) {
    filter.userId = req.query.userId;
  }
  let posts;

  const page = req.query.page;
  if (page <= 0) {
    return sendMsg(res, 'bad_page_value', 422);
  }
  if (page) {
    posts = await Post.find(filter).sort({date: -1}).limit(PER_PAGE).skip(PER_PAGE * (page - 1));
  } else {
    posts = await Post.find(filter).sort({date: -1});
  }

  return res.send(posts);
};

const getPostByID = async (req, res) => {
  let post;
  try {
    post = await Post.findOne({ _id: req.params.id });
  } catch (err) {
    return sendMsg(res, 'post_not_found', 404);
  }
  if (!post) return sendMsg(res, 'post_not_found', 404);
  return res.send(post);
};

const editPost = async (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;

  let post;
  try {
    post = await Post.findOne({ _id: req.params.id });
  } catch (err) {
    return sendMsg(res, 'post_not_found', 404);
  }

  // 403 Forbidden
  if (!post.userId.equals(req.userId)) return sendMsg(res, 'forbidden', 403);

  const postSchema = {
    desc: req.body.desc
  };
  try {
    await post.updateOne(postSchema);
    const editedPost = await Post.findOne({ _id: post._id });
    res.send(editedPost);
  } catch (err) {
    if (err.message) {
      // 422 Unprocessable Entity
      return sendMsg(res, err.message, 422);
    } else {
      // Server error
      return sendMsg(res, 'server_error', 500);
    }
  }
};

const getFeed = async (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;
  if (req.userId !== req.params.userId) return sendMsg(res, 'forbidden', 403);

  const user = await User.findOne({ _id: req.userId });
  if (!user) return sendMsg(res, 'user_not_found', 404);

  const friends = user.data.friends;
  const posts = await Post.find({userId: {$in: friends.map((f) => f._id)}})
    .sort({date: -1});

  return res.send(posts);
};

const viewPost = async (req, res) => {
  let post;
  try {
    post = await Post.findOne({ _id: req.params.id });
  } catch (err) {
    return sendMsg(res, 'post_not_found', 404);
  }

  const postSchema = {
    views: post.views + 1
  };
  try {
    await post.updateOne(postSchema);
    return sendMsg(res, 'post_viewed');
  } catch (err) {
    if (err.message) {
      // 422 Unprocessable Entity
      return sendMsg(res, err.message, 422);
    } else {
      // Server error
      return sendMsg(res, 'server_error', 500);
    }
  }
};

module.exports = { createPost, getAllPosts, getPostByID, editPost, getFeed, viewPost };
