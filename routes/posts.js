const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {check} = require('express-validator');

const postController = require('../controllers/posts');

// @route     GET api/contacts
// @desc      Get all users contacts
// @access    Private
router.get('/', auth, postController.getAllPosts);

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
    ],
  ],
  postController.createPost
);

// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put('/:id', auth, postController.updatePost);

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete('/:id', auth, postController.deletePost);

// @route     get api/contacts/:id
// @desc      Get single contact
// @access    Private
router.get('/:id', auth, postController.getSinglePost);

module.exports = router;
