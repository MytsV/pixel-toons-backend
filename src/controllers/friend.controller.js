const {validateToken} = require('../middleware');
const User = require('../models/user.model');

const addFriend = async (req, res) => {
  if (!req.query.friendId) return res.status(422).send('Parameter missing');
  validateToken(req, res);
  if (!req.userId) return;
  const user = await User.findOne({_id: req.userId});
  if (!user) return res.status(404).send('User not found');

  const friend = await User.findOne({_id: req.query.friendId});
  if (!friend) return res.status(404).send('Friend not found');

  const newFriends = [...user.data.friends];
  newFriends.push(friend._id);
  await user.updateOne({
    data: {
      friends: newFriends,
    },
  });

  return res.send('Successfully added a friend');
};

const getFriends = async (req, res) => {
  if (!req.query.id) return res.status(422).send('Parameter missing');
  const user = await User.findOne({_id: req.query.id});
  if (!user) return res.status(404).send('User not found');
  const friends = await User.find({_id: {$in: user.data.friends}});
  res.send(friends.map((u) => {
    //TODO: extract
    return {
      id: u._id,
      username: u.username,
      joinDate: u.joinDate,
      data: u.data,
    };
  }));
};

//TODO: deletion

module.exports = {addFriend, getFriends};
