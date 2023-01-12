const Post = require("../models/post.model");
const {validateToken} = require("../middleware");
const User = require("../models/user.model");
const sendMsg = require("../middleware/message_builder");

const PER_PAGE = 10;

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
    posts = await Post.find(filter).limit(PER_PAGE).skip(PER_PAGE * (page - 1));
  } else {
    posts = await Post.find(filter);
  }

  return res.send(posts.map((p) => ({
    id: p._id,
    userId: p.userId,
    name: p.name,
    desc: p.desc,
    url: p.url,
    date: p.date
  })));
};

module.exports = {createPost, getAllPosts};
