const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Rating = require('../models/rating');
const User = require('../models/user');

// GET api/movies?limit=100&offset=0
router.get('/', (req, res) => {
    Movie.findAll({
        limit: req.query.limit || 100,
        offset: req.query.offset || 0
    }).then(data => {
        res.status(200).json({
            movies: data
        });
    });
});

// GET api/movies/:name
router.get('/:name', (req, res) => {
    const name = req.params.name;
    Movie.findAll({
        where: {
            name: name
        },
    }).then(data => {
        res.status(200).json({
            movie: data
        });
    });
});

// GET api/movies/:name/comments
router.get('/:name/comments', (req, res) => {
    const name = req.params.name;
    Comment.findAll({
        attributes: ['commentid', 'title', 'description', 'date'],
        include: [{
            attributes: ['login'],
            model: User,
            required: true
        },
        {
            attributes: [],
            model: Movie,
            required: true,
            where: {
                name: name
            }
        }] 
      }).then(data => {
        res.status(200).json({
            comments: data
        });
    });
});

// GET api/movies/:name/ratings
router.get('/:name/ratings', (req, res) => {
    const name = req.params.name;
    Rating.findAll({
        attributes: ['ratingid', 'stars', 'date'],
        include: [{
            attributes: ['login'],
            model: User,
            required: true
        },
        {
            model: Movie,
            attributes: [],
            required: true,
            where: {
                name: name
            }
        }] 
      }).then(data => {
        res.status(200).json({
            ratings: data
        });
    });
});

// POST api/movies
router.post('/', (req, res) => {
    Movie.create({
        title: req.body.title,
        name: req.body.name,
        director: req.body.director,
        duration: req.body.duration,
        genre: req.body.genre,
        releasedate: req.body.releasedate,
        description: req.body.description,
        rating: req.body.rating,
    }).then((data)=>{
        res.status(200).json({
            movie: data
        })
    }).catch((err)=>{
        res.status(400).json({
            message: err
        })
    })
});

// PUT api/movies/:id
router.put('/:id', (req, res) => {
    const id = req.params.id;
    Movie.update({
        title: req.body.title,
        name: req.body.name,
        director: req.body.director,
        duration: req.body.duration,
        genre: req.body.genre,
        releasedate: req.body.releasedate,
        description: req.body.description,
        rating: req.body.rating,
    },{
        where: {
            movieid: id
        }
    }).then(()=>{
        res.status(200).json({
            message: 'Movie has been updated'
        })
    }).catch((err)=>{
        res.status(400).json({
            message: err
        })
    })
});

// DELETE api/movies/:id
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Movie.destroy({
        where:{
            movieid: id
        }
    }).then(()=>{
        res.status(200).json({
            message: 'Movie has been removed'
        })
    }).catch((err)=>{
        res.status(400).json({
            message: err
        })
    })
});

module.exports = router;