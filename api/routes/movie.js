const express = require('express');
const router = express.Router();

const checkToken = require('../middleware/checkToken');

const movieController = require('../controllers/movie');

// GET api/movies?limit=100&offset=0&orderBy=date&search=Av
router.get('/', movieController.getMovies);

// GET api/movies/:name
router.get('/:name', movieController.getMovieByName);

// GET api/movies/:name/comments
router.get('/:name/comments', movieController.getMovieComments);

// GET api/movies/:name/ratings
router.get('/:name/ratings', movieController.getMovieRatings);

// POST api/movies
router.post('/', checkToken, movieController.addMovie);

// PUT api/movies/:id
router.put('/:id', checkToken, movieController.updateMovie);

// DELETE api/movies/:id
router.delete('/:id', checkToken, movieController.deleteMovie);

module.exports = router;