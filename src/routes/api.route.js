const express = require("express");
const {signUp, signIn} = require("../controllers/auth.controller");
const {tokenToID} = require("../controllers/auth.test.controller");
const router = new express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.post('/test/validate', tokenToID);

module.exports = router;
