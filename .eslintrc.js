module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'metarhia',
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    "arrow-parens": ["error", "always"],
    "comma-dangle": "off",
    "handle-callback-err": "off",
    "consistent-return": "off",
    "no-dupe-class-members": "off", //babel-parser error
    "max-len": [
      "error",
      {
        "code": 80,
        "ignoreUrls": true
      }
    ]
  },
};
