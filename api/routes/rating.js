const express = require('express');
const router = express.Router();

const ratingController = require('../controllers/rating');

const checkToken = require('../middleware/checkToken');

// GET api/ratings?limit=100&offset=0
router.get('/', checkToken, ratingController.getRatings)

// GET api/ratings/:id
router.get('/:id', ratingController.getRatingById)

// POST api/ratings
router.post('/', checkToken, ratingController.addRating)

// PATCH api/ratings/:id
router.patch('/:id', checkToken, ratingController.updateRating)

// DELETE api/ratings/:id
router.delete('/:id', checkToken, ratingController.deleteRating)

module.exports = router;