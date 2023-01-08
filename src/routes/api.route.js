const express = require("express");
const {signUp, signIn, signOut} = require("../controllers/auth.controller");
const router = new express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);

module.exports = router;
