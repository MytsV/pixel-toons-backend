const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const {getSignUpError} = require("../middleware/authValidation");

const handleSignUpError = (err, res) => {
  if (err.message) {
    //422 Unprocessable Entity
    res.status(422).send(err.message);
  } else if (err.index) {
    //422 Unprocessable Entity
    res.status(422).send('User with such email or username already exists');
  } else {
    //Server Error
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
  });
  user.save((err, user) => {
    if (err != null) {
      handleSignUpError(err, res);
    } else {
      res.send("User was successfully created");
    }
  });
};

const signIn = (req, res) => {

};

const signOut = (req, res) => {

};

module.exports = {signUp, signIn, signOut};
