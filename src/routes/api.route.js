const express = require('express');
const { signUp, signIn } = require('../controllers/auth.controller');
const { uploadFile, downloadFile } = require('../controllers/static_file.controller');
const { getAllUsers, getUserById, editUser } = require('../controllers/user.controller');
const { addFriend, getFriends, deleteFriend } = require('../controllers/friend.controller');
const { getAllPosts, createPost, getPostByID, editPost } = require('../controllers/post.controller');

const router = new express.Router();
router
  .post('/auth/sign-up', signUp)
  .post('/auth/sign-in', signIn)

  .get('/user', getAllUsers)
  .get('/user/:id', getUserById)
  .put('/user/:id', editUser)

  .post('/uploads', uploadFile)
  .get('/uploads/:name', downloadFile)

  .get('/friend/:id', getFriends)
  .post('/friend/:id', addFriend)
  .delete('/friend/:id', deleteFriend)

  .get('/post', getAllPosts)
  .post('/post', createPost)
  .get('/post/:id', getPostByID)
  .put('/post/:id', editPost);

module.exports = router;
