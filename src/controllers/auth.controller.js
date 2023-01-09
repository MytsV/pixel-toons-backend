const User = require('../models/user.model');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {getSignUpError} = require('../middleware/auth_validation');

const handleSignUpError = (err, res) => {
  if (err.message) {
    // 422 Unprocessable Entity
    res.status(422).send(err.message);
  } else if (err.index) {
    // 422 Unprocessable Entity
    res.status(422).send('User with such email or username already exists');
  } else {
    // Server Error
    res.status(500).send(err.message);
  }
};

const SALT_ROUNDS = 8;

const signUp = (req, res) => {
  const err = getSignUpError(req);
  if (err != null) {
    return handleSignUpError(err, res);
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, SALT_ROUNDS),
    joinDate: new Date(),
    data: {
      friends: []
    },
  });
  user.save((err, user) => {
    if (err != null) {
      handleSignUpError(err, res);
    } else {
      res.send('User was successfully created');
    }
  });
};

const handleSignInError = (err, res) => {
  // Server Error
  res.status(500).send(err.message);
};

const signIn = (req, res) => {
  if (!req.body.password) {
    // 422 Unprocessable Entity
    return res.status(422).send('Password is required!');
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
    if (err != null) return handleSignInError(err, res);
    if (!user) return res.status(404).send('User hasn\'t been found');

    const isPassValid = bcrypt.compareSync(
        req.body.password,
        user.password,
    );
    if (!isPassValid) return res.status(404).send('Password isn\'t valid');

    const token = jwt.sign({id: user.id}, config.secret, {
      expiresIn: 24 * 60 * 60, // 24 hours
    });

    res.send({
      id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    });
  });
};

module.exports = {signUp, signIn};
