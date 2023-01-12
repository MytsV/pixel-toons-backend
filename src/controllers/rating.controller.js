const sendMsg = require("../middleware/message_builder");
const {validateToken} = require("../middleware");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Rating = require("../models/rating.model");

const addRating = (upvote) => async (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;

  const user = await User.findOne({ _id: req.userId });
  if (!user) return sendMsg(res, 'user_not_found', 404);

  if (!req.query.postId) return sendMsg(res, 'post_id_missing', 422);

  let post;
  try {
    post = await Post.findOne({ _id: req.params.id });
  } catch (err) {
    return sendMsg(res, 'post_not_found', 404);
  }
  if (!post) return sendMsg(res, 'post_not_found', 404);

  const filter = {
    userId: user._id,
    postId: post._id,
  };
  if (Rating.exists(filter)) {
    Rating.deleteOne(filter);
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

module.exports = {addRating};
