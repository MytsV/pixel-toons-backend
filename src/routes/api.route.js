const express = require("express");
const {signUp, signIn} = require("../controllers/auth.controller");
const {tokenToID} = require("../controllers/auth.test.controller");
const {editUser} = require("../controllers/edit.controller");
const router = new express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.get('/test/validate', tokenToID);

router.post('/edit-user/:id', editUser);

module.exports = router;
