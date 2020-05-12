const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment');

const checkToken = require('../middleware/checkToken');

// GET api/comments?limit=100&offset=0
router.get('/', checkToken, commentController.getComments)

// GET api/comments/:id
router.get('/:id', commentController.getCommentById)

// POST api/comments
router.post('/', checkToken, commentController.addComment)

// PATCH api/comments/:id
router.patch('/:id', checkToken, commentController.updateCommment)

// DELETE api/comments/:id
router.delete('/:id', checkToken, commentController.deleteComment)

module.exports = router;