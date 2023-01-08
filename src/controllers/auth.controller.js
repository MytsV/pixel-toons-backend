const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const {isSignUpValid} = require("../middleware/authValidation");

const SALT_ROUNDS = 8;

const signUp = (req, res) => {
  if (!isSignUpValid(req)) {
    return res.status(422).send('Invalid data');
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, SALT_ROUNDS),
  });
  user.save((err, user) => {
    if (err != null) {
      //TODO: handle via different function
      res.status(422).send(err);
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
