const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Rating = require('../models/rating');
const User = require('../models/user');

const Sequelize = require("sequelize");

exports.getMovies = (req, res) => {
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
}

exports.getMovieByName = (req, res) => {
    const name = req.params.name;
    Movie.findOne({
        where: {
            name: name
        },
    }).then(data => {
        res.status(200).json(data);
    });
}

exports.getMovieComments = (req, res) => {
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
            attributes: ['login', 'avatar'],
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
}

exports.getMovieRatings = (req, res) => {
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
}

exports.addMovie = (req, res) => {
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
        res.status(201).json({
            movie: data
        })
    }).catch((err)=>{
        res.status(500).json({
            message: err
        })
    })
}

exports.updateMovie = (req, res) => {
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
}

exports.deleteMovie = (req, res) => {
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
}