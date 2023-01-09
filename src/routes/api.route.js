const express = require("express");
const {signUp, signIn} = require("../controllers/auth.controller");
const {tokenToID} = require("../controllers/auth.test.controller");
const {editUser} = require("../controllers/edit.controller");
const {uploadFile, downloadFile} = require("../controllers/static_file.controller");
const router = new express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

router.get('/test/validate', tokenToID);

router.post('/edit-user/:id', editUser);

router.post('/upload-file', uploadFile);
router.get('/uploads/:name', downloadFile);

module.exports = router;
