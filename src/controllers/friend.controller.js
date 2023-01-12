const { validateToken } = require('../middleware');
const User = require('../models/user.model');
const sendMsg = require("../middleware/message_builder");

const addFriend = async (req, res) => {
  if (!req.query.friendId) {
    // 422 Unprocessable Entity
    return sendMsg(res, 'friend_id_missing', 422);
  }

  validateToken(req, res);
  if (!req.userId) return;

  const user = await User.findOne({ _id: req.userId });
  if (!user) return sendMsg(res, 'user_not_found', 404);

  let friend;
  try {
    friend = await User.findOne({_id: req.query.friendId});
  } catch (e) {
    return sendMsg(res, 'friend_not_found', 404);
  }
  if (!friend) return sendMsg(res, 'friend_not_found', 404);

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

  return sendMsg(res, 'friend_added', 200);
};

const getFriends = async (req, res) => {
  if (!req.query.id) {
    // 422 Unprocessable Entity
    return sendMsg(res, 'id_missing', 422);
  }

  const user = await User.findOne({ _id: req.query.id });
  if (!user) return sendMsg(res, 'user_not_found', 404);
  const friends = await User.find({ _id: { $in: user.data.friends } });
  res.send(friends.map((u) =>
    //TODO: extract
    ({
      id: u._id,
      username: u.username,
      joinDate: u.joinDate,
      data: u.data,
    })
  ));
};

//TODO: deletion

module.exports = { addFriend, getFriends };
