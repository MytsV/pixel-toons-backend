const sendMsg = (res, text, status = 200) => {
  res.status(status).send({
    status: status,
    message: text
  });
};

module.exports = sendMsg;
