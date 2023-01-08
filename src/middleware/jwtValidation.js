const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const verifyToken = (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    //403 Forbidden
    return res.status(403).send('No token provided!');
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      //401 Unauthorized
      return res.status(401).send('Unauthorized!');
    }
    req.userId = decoded.id;
  });
};

module.exports = {verifyToken};
