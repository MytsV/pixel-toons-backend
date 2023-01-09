const express = require('express');
const {signUp, signIn} = require('../controllers/auth.controller');
const {tokenToID} = require('../controllers/auth.test.controller');
const {editUser} = require('../controllers/user-edit.controller');
const {uploadFile, downloadFile} = require('../controllers/static_file.controller');
const {getAll, getById} = require('../controllers/user.controller');
const {addFriend} = require('../controllers/friend.controller');
const router = new express.Router();

router.post('/signup', signUp)
    .post('/signin', signIn);

router.get('/test/validate', tokenToID);

router.put('/edit-user/:id', editUser);

router.post('/upload-file', uploadFile)
    .get('/uploads/:name', downloadFile);

router.get('/user', getAll)
    .get('/user/:id', getById);

router.post('/friend', addFriend);

module.exports = router;
