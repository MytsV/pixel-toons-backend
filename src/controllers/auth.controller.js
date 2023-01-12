const User = require('../models/user.model');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { getSignUpError } = require('../middleware/auth_validation');
const sendMsg = require("../middleware/message_builder");

const handleSignUpError = (err, res) => {
  if (err.message) {
    // 422 Unprocessable Entity
    sendMsg(res, err.message, 422);
  } else if (err.index) {
    // 422 Unprocessable Entity
    sendMsg(res, 'user_already_exists', 422);
  } else {
    // Server Error
    sendMsg(res, err.message, 500);
  }
};

const SALT_ROUNDS = 8;

const signUp = (req, res) => {
  const err = getSignUpError(req);
  if (err !== null) {
    // Server Error
    return sendMsg(res, err.message, 500);
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, SALT_ROUNDS),
    joinDate: new Date(),
    data: {
      friends: [],
    },
  });
  user.save((err, _) => {
    if (err !== null) {
      handleSignUpError(err, res);
    } else {
      sendMsg(res, 'successfully_created');
    }
  });
};

const signIn = (req, res) => {
  if (!req.body.password) {
    // 422 Unprocessable Entity
    return sendMsg(res, 'password_required', 422);
  }
  User.findOne({
    '$or': [
      {
        username: req.body.login,
      },
      {
        email: req.body.login,
      },
    ],
  }).exec((err, user) => {
    if (err !== null) return sendMsg(res, err.message, 500);
    if (!user) return sendMsg(res, 'user_not_found', 404);

    const isPassValid = bcrypt.compareSync(
      req.body.password,
      user.password,
    );
    if (!isPassValid) return sendMsg(res, 'password_invalid', 404);

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 24 * 60 * 60, // 24 hours
    });

    res.send({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  });
};

module.exports = { signUp, signIn };
