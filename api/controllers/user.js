const User = require('../models/user');
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Rating = require('../models/rating');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['userid', 'login', 'firstname', 'lastname', 'email', 'avatar'],
            limit: req.query.limit || 100,
            offset: req.query.offset || 0
        })
        res.status(200).json(users);
    } catch (err){
        res.status(500).json(err);
    }
}

exports.getUserByLogin = async (req, res) => {
    const login = req.params.login;
    try {
        const user = await User.findOne({
            attributes: ['login', 'firstname', 'lastname', 'email', 'avatar'],
            where: {
                login: login
            }
        })
        res.status(200).json(user);
    } catch (err){
        res.status(500).json(err);
    }
}

exports.getUserComments = async (req, res) => {
    const login = req.params.login;
    const limit = req.query.limit;
    const offset = req.query.offset;
    try{
        const comments = await Comment.findAll({
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
        })
        res.status(200).json(comments);
    } catch(err) {
        res.status(500).json(err);
    }
}

exports.getUserRatings = async (req, res) => {
    const login = req.params.login;
    const orderBy = req.query.orderBy || 'date';
    const limit = req.query.limit;
    const offset = req.query.offset;
    try {
        const ratings = await Rating.findAll({
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
        })
        res.status(200).json(ratings);
    } catch(err){
        res.status(500).json(err);
    }
}

exports.getUserRatingByMovieId = async (req, res) => {
    const userid = req.params.userid;
    const movieid = req.params.movieid;
    try {
        const rating = await Rating.findOne({
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
        })
        res.status(200).json(rating);
    } catch(err){
        res.status(500).json(err);
    }
}

exports.updateUser = async (req, res) => {
    const id = req.params.id;

    if(id != req.userId){
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
    else{
        bcrypt.hash(req.body.password, 10, async (error, hash) => {
            if(!error){
                try {
                    const result = await User.update({
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
                    })
                    if(result){
                        res.status(200).json({
                            message: 'User has been updated!'
                        });
                    }
                } catch (err) {
                    res.status(500).json(err);
                }
            }
            else{
                res.status(500).json(error);
            }
        })
    }
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    if(id != req.userId){
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
    else{
        try {
            const result = await User.destroy({
                where:{
                    userid: id
                }
            })
            if(result) {
                res.status(200).json({
                    message: 'User has been removed from database',
                });
            }
        } catch(err) {
            res.status(500).json(err);
        }
    }
}