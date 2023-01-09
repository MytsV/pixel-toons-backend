const {validateToken} = require("../middleware");
const User = require("../models/user.model");

const editUser = async (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;
  //403 Forbidden
  if (req.params.id !== req.userId) return res.status(403).send('Forbidden');
  const user = await User.findOne({_id: req.userId});
  if (!user) return res.status(404).send('User not found');
  const data = {
    biography: req.body.biography,
    avatarUrl: req.body.avatarUrl
  };
  const userSchema = {
    username: user.username,
    email: user.email,
    password: user.password,
    joinDate: user.joinDate,
    data: data
  };
  try {
    await user.updateOne(userSchema);
    const editedUser = await User.findOne({_id: req.userId});
    res.send(editedUser);
  } catch (err) {
    if (err.message) {
      //422 Unprocessable Entity
      return res.status(422).send(err);
    } else {
      //Server error
      return res.status(500).send(err);
    }
  }
};

module.exports = {editUser};
