const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Rating = require('../models/rating');
const User = require('../models/user');
const checkToken = require('../token/checkToken');
const Sequelize = require("sequelize");

// GET api/movies?limit=100&offset=0&orderBy=date&search=Av
router.get('/', (req, res) => {
    const orderBy = req.query.orderBy || 'rating';
    const search = req.query.search ? '%' + req.query.search + '%' : '%%';
    Movie.findAll({
        order: [[orderBy, 'DESC']],
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        where: {
            title: {
                [Sequelize.Op.iLike]: search
            }
        },
    }).then(data => {
        res.status(200).json(data);
    });
});

// GET api/movies/:name
router.get('/:name', (req, res) => {
    const name = req.params.name;
    Movie.findOne({
        where: {
            name: name
        },
    }).then(data => {
        res.status(200).json(data);
    });
});

// GET api/movies/:name/comments
router.get('/:name/comments', (req, res) => {
    const name = req.params.name;
    const limit = req.query.limit;
    const offset = req.query.offset;
    Comment.findAll({
        limit: limit || 50,
        offset: offset || 0,
        order: [['date', 'DESC']],
        attributes: ['commentid', 'title', 'description', 'date'],
        where: {
            threadid: null
        },
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
        res.status(200).json(data);
    });
});

// GET api/movies/:name/ratings
router.get('/:name/ratings', (req, res) => {
    const name = req.params.name;
    const limit = req.query.limit;
    const offset = req.query.offset;
    Rating.findAll({
        limit: limit || 50,
        offset: offset || 0,
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
        res.status(200).json(data);
    });
});

// POST api/movies
router.post('/', checkToken, (req, res) => {
    Movie.create({
        title: req.body.title,
        name: req.body.name,
        director: req.body.director,
        duration: req.body.duration,
        genre: req.body.genre,
        releasedate: req.body.releasedate,
        description: req.body.description,
        rating: 0.0,
        poster: req.body.poster
    }).then((data)=>{
        res.status(200).json({
            movie: data
        })
    }).catch((err)=>{
        res.status(500).json({
            message: err
        })
    })
});

// PUT api/movies/:id
router.put('/:id', checkToken, (req, res) => {
    const id = req.params.id;
    Movie.update({
        title: req.body.title,
        name: req.body.name,
        director: req.body.director,
        duration: req.body.duration,
        genre: req.body.genre,
        releasedate: req.body.releasedate,
        description: req.body.description,
        poster: req.body.poster
    },{
        where: {
            movieid: id
        }
    }).then(()=>{
        res.status(200).json({
            message: 'Movie has been updated'
        })
    }).catch((err)=>{
        res.status(500).json({
            message: err
        })
    })
});

// DELETE api/movies/:id
router.delete('/:id', checkToken, (req, res) => {
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
        res.status(500).json({
            message: err
        })
    })
});

module.exports = router;