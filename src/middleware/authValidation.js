const isSignUpValid = (req) => {
  const pass = req.body.password;
  return pass !== undefined && /[0-9a-zA-Z]{6,20}/.test(pass);
}

module.exports = {isSignUpValid};
