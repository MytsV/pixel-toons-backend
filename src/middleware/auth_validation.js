const getSignUpError = (req) => {
  const pass = req.body.password;
  const invalid = {
    'message': 'Password must contain from 6 to 20 symbols, which do not include special characters',
  };
  return (pass !== undefined && /[0-9a-zA-Z]{6,20}/.test(pass)) ? null : invalid;
};

module.exports = {getSignUpError};
