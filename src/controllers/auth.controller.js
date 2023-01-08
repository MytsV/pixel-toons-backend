const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 8;

const signUp = (req, res) => {
  //TODO: handle verification
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, SALT_ROUNDS),
  });
  user.save((err, user) => {
    //TODO: handle errors
  });
  res.status(200).send("User was successfully created");
};

const signIn = (req, res) => {

};

const signOut = (req, res) => {

};

module.exports = {signUp, signIn, signOut};
