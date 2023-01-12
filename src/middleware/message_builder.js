const sendMsg = (res, text, status) => {
  res.status(status).send({
    status: status,
    message: text
  });
};

module.exports = sendMsg;
