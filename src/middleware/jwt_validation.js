const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const sendMsg = require("../middleware/message_builder");

const validateToken = (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    // 403 Forbidden
    return sendMsg(res, 'no_auth_token', 403);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      // 401 Unauthorized
      return sendMsg(res, 'unauthorized', 401);
    }
    req.userId = decoded.id;
  });
};

module.exports = { validateToken };
