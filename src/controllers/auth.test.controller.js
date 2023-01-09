const {validateToken} = require("../middleware");

const tokenToID = (req, res) => {
  validateToken(req, res);
  if (req.userId) {
    return res.send({"id": req.userId});
  }
};

module.exports = {tokenToID};
