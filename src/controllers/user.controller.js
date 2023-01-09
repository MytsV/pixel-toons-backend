const {validateToken} = require("../middleware");
const User = require("../models/user.model");

const PER_PAGE = 10;

const getById = async (req, res) => {
  try {
    validateToken(req, null);
  } catch (err) {
  }
  let user;
  try {
    user = await User.findOne({_id: req.params.id});
  } catch (err) {
    return res.status(404).send('User not found');
  }
  if (!user) return res.status(404).send('User not found');
  const data = {
    username: user.username,
    joinDate: user.joinDate,
    data: user.data
  };
  if (req.userId === req.params.id) {
    data.email = user.email;
    data.password = user.password;
  }
  return res.send(data);
};

const getAll = async (req, res) => {
  const filter = {};
  if (req.query.name) {
    filter.username = new RegExp(`${req.query.name}.*`, 'gi');
  }
  let users;

  const page = req.query.page;
  if (page <= 0) {
    return res.status(422).send('Bad page value');
  }
  if (page) {
    users = await User.find(filter).limit(PER_PAGE).skip(PER_PAGE * (page - 1));
  } else {
    users = await User.find(filter);
  }

  return res.send(users.map((u) => {
    return {
      id: u._id,
      username: u.username,
      joinDate: u.joinDate,
      data: u.data
    };
  }));
}

module.exports = {getById, getAll};
