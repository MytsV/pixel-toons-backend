const { validateToken } = require('../middleware');
const User = require('../models/user.model');
const sendMsg = require("../middleware/message_builder");

const addFriend = async (req, res) => {
  if (!req.params.id) {
    // 422 Unprocessable Entity
    return sendMsg(res, 'id_missing', 422);
  }

  validateToken(req, res);
  if (!req.userId) return;

  const user = await User.findOne({ _id: req.userId });
  if (!user) return sendMsg(res, 'user_not_found', 404);

  let friend;
  try {
    friend = await User.findOne({_id: req.params.id});
  } catch (e) {
    return sendMsg(res, 'friend_not_found', 404);
  }
  if (!friend) return sendMsg(res, 'friend_not_found', 404);

  if (user._id.equals(friend._id)) {
    return sendMsg(res, 'cannot_add_self', 422);
  }

  if (user.data.friends.includes(friend._id)) {
    return sendMsg(res, 'friend_already_in', 422);
  }

  const newFriends = [...user.data.friends];
  newFriends.push(friend._id);
  await user.updateOne({
    data: {
      friends: newFriends,
    },
  });

  return sendMsg(res, 'friend_added');
};

const getFriends = async (req, res) => {
  if (!req.params.id) {
    // 422 Unprocessable Entity
    return sendMsg(res, 'id_missing', 422);
  }

  const user = await User.findOne({ _id: req.params.id });
  if (!user) return sendMsg(res, 'user_not_found', 404);
  const friends = await User.find({ _id: { $in: user.data.friends } });
  res.send(friends.map((u) =>
    ({
      id: u._id,
      username: u.username,
      joinDate: u.joinDate,
      data: u.data,
    })
  ));
};

const deleteFriend = async (req, res) => {
  if (!req.params.id) {
    // 422 Unprocessable Entity
    return sendMsg(res, 'id_missing', 422);
  }

  validateToken(req, res);
  if (!req.userId) return;

  const user = await User.findOne({ _id: req.userId });
  if (!user) return sendMsg(res, 'user_not_found', 404);

  let friend;
  try {
    friend = await User.findOne({_id: req.params.id});
  } catch (e) {
    return sendMsg(res, 'friend_not_found', 404);
  }
  if (!friend) return sendMsg(res, 'friend_not_found', 404);

  if (!user.data.friends.includes(friend._id)) {
    return sendMsg(res, 'friend_not_in', 422);
  }

  const newFriends = user.data.friends.filter((u) => !u._id.equals(friend._id));
  await user.updateOne({
    data: {
      friends: newFriends,
    },
  });

  return sendMsg(res, 'friend_deleted');
};

module.exports = { addFriend, getFriends, deleteFriend };
