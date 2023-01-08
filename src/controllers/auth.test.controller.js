const {verifyToken} = require("../middleware");

const tokenToID = (req, res) => {
  verifyToken(req, res);
  if (req.userId) {
    res.send({"id": req.userId});
  }
};

module.exports = {tokenToID};
