const { validateToken } = require('../middleware');
const User = require('../models/user.model');
const sendMsg = require("../middleware/message_builder");

const editUser = async (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;
  // 403 Forbidden
  if (req.params.id !== req.userId) return sendMsg(res, 'forbidden', 403);
  const user = await User.findOne({ _id: req.userId });
  if (!user) return sendMsg(res, 'user_not_found', 404);
  const userSchema = {
    data: {
      biography: req.body.biography,
      avatarUrl: req.body.avatarUrl,
    },
  };
  try {
    await user.updateOne(userSchema);
    const editedUser = await User.findOne({ _id: req.userId });
    res.send(editedUser);
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

module.exports = { editUser };
