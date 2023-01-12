const express = require('express');
const { signUp, signIn } = require('../controllers/auth.controller');
const { editUser } = require('../controllers/user-edit.controller');
const { uploadFile, downloadFile } = require('../controllers/static_file.controller');
const { getAll, getById } = require('../controllers/user.controller');
const { addFriend, getFriends, deleteFriend } = require('../controllers/friend.controller');

const router = new express.Router();
router
  .post('/auth/sign-up', signUp)
  .post('/auth/sign-in', signIn)

  .get('/user', getAll)
  .get('/user/:id', getById)
  .put('/user/:id', editUser)

  .post('/uploads', uploadFile)
  .get('/uploads/:name', downloadFile)

  .get('/friend/:id', getFriends)
  .post('/friend/:id', addFriend)
  .delete('/friend/:id', deleteFriend);

module.exports = router;
