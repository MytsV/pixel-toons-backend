const { validateToken } = require('../middleware');
const User = require('../models/user.model');
const sendMsg = require("../middleware/message_builder");

const PER_PAGE = 10;

const getById = async (req, res) => {
  try {
    validateToken(req, null);
  } catch (err) {
  }
  let user;
  try {
    user = await User.findOne({ _id: req.params.id });
  } catch (err) {
    return sendMsg(res, 'user_not_found', 404);
  }
  if (!user) return sendMsg(res, 'user_not_found', 404);
  const data = {
    username: user.username,
    joinDate: user.joinDate,
    data: user.data,
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
    return sendMsg(res, 'bad_page_value', 422);
  }
  if (page) {
    users = await User.find(filter).limit(PER_PAGE).skip(PER_PAGE * (page - 1));
  } else {
    users = await User.find(filter);
  }

  return res.send(users.map((u) => ({
    id: u._id,
    username: u.username,
    joinDate: u.joinDate,
    data: u.data,
  })));
};

module.exports = { getById, getAll };
