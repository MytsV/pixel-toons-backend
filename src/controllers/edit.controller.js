const {validateToken} = require("../middleware");
const User = require("../models/user.model");

const editUser = (req, res) => {
  validateToken(req, res);
  if (!req.userId) return;
  //403 Forbidden
  if (req.params.id !== req.userId) return res.status(403).send('Forbidden');
  const user = User.findOne({_id: req.userId});
  if (!user) return res.status(404).send('Not found');
  res.send('Editing!');
  const data = {
    biography: req.body.userId,
    avatarUrl: req.body.avatarUrl
  };
};

module.exports = {editUser};
