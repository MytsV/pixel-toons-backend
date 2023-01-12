const sendMsg = (res, text, status = 200) => {
  res.status(status).send({
    status,
    message: text
  });
};

module.exports = sendMsg;
