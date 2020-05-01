const User = require('../models/user');
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Rating = require('../models/rating');

const bcrypt = require('bcrypt');

exports.getUsers = (req, res) => {
    User.findAll({
        // do not return password
        attributes: ['login', 'firstname', 'lastname', 'email', 'phone', 'birth', 'avatar'],
        limit: req.query.limit || 100,
        offset: req.query.offset || 0
    }).then(data => {
        res.status(200).json(data);
    });
}

exports.getUserByLogin = (req, res) => {
    const login = req.params.login;
    User.findOne({
        // do not return password
        attributes: ['login', 'firstname', 'lastname', 'email', 'phone', 'birth', 'avatar'],
        where: {
            login: login
        }
    }).then(data => {
        res.status(200).json(data);
    })
}

exports.getUserComments = (req, res) => {
    const login = req.params.login;
    const limit = req.query.limit;
    const offset = req.query.offset;
    Comment.findAll({
        limit: limit || 50,
        offset: offset || 0,
        order: [['date', 'DESC']],
        attributes: ['commentid', 'title', 'description', 'date'],
        include: [{
            model: Movie,
            attributes: ['title', 'name',  'director', 'genre', 'rating', 'releasedate', 'duration', 'poster'],
            required: true
        },{
            model: User,
            attributes: [],
            required: true,
            where: {
                login: login
            }
        }]
    }).then(data => {
        res.status(200).json(data);
    });
}

exports.getUserRatings = (req, res) => {
    const login = req.params.login;
    const orderBy = req.query.orderBy || 'date';
    const limit = req.query.limit;
    const offset = req.query.offset;
    Rating.findAll({
        limit: limit || 50,
        offset: offset || 0,
        order: [[orderBy, 'DESC']],
        attributes: ['ratingid', 'stars', 'date'],
        include: [{
            model: Movie,
            attributes: ['title', 'name', 'director', 'genre', 'rating', 'releasedate', 'duration',  'poster'],
            required: true       
        },{
            model: User,
            attributes: [],
            required: true,
            where: {
                login: login
            }
        }]
    }).then(data => {
        res.status(200).json(data)
    });
}

exports.getUserRatingByMovieId = (req, res) => {
    const userid = req.params.userid;
    const movieid = req.params.movieid;
    Rating.findOne({
        attributes: ['ratingid', 'stars', 'date'],
        where: {
            movieid: movieid
        },
        include: [{
            model: Movie,
            attributes: ['title', 'name', 'director', 'genre', 'rating', 'releasedate', 'duration',  'poster'],
            required: true       
        },{
            model: User,
            attributes: [],
            required: true,
            where: {
                userid: userid
            }
        }]
    }).then(data => {
        res.status(200).json(data)
    });
}

exports.addUser = (req, res) => {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (!error){
            User.create({
                login: req.body.login,
                password: hash,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                birth: req.body.birth,
                avatar: null
            }).then((data) => {
                res.status(201).json(data);
            }).catch((err) => {
                res.status(500).json({
                    response: err
                });
            });
        } else{
            res.status(500).json({
                message: error
            })
        }
    })
}

exports.updateUser = (req, res) => {
    const id = req.params.id;
    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if(!error){
            User.update({
                login: req.body.login,
                password: hash,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                birth: req.body.birth,
                avatar: req.body.avatar
            },  {
                where: {
                    userid: id
                }
            }).then(() => {
                res.status(200).json({
                    message: 'User has been updated!'
                });
            }).catch((err)=>{
                res.status(500).json({
                    message: err
                });
            });
        }
        else{
            res.status(500).json({
                message: error
            })
        }
    })
}

exports.deleteUser = (req, res) => {
    const id = req.params.id;
    User.destroy({
        where:{
            userid: id
        }
    }).then(() => {
        res.status(200).json({
            message: 'User has been removed from database',
        });
    }).catch((err)=>{
        res.status(500).json({
            message: err
        });
    });
}