const Post = require("../models/post.model");
const {validateToken} = require("../middleware");
const User = require("../models/user.model");
const sendMsg = require("../middleware/message_builder");

const createPost = async (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;

  const user = await User.findOne({ _id: req.userId });
  if (!user) return sendMsg(res, 'user_not_found', 404);

  const post = new Post({
    user_id: req.userId,
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

module.exports = {createPost};
