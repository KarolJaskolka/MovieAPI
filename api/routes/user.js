const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Rating = require('../models/rating');

// GET api/users?limit=100&offset=0
router.get('/', (req, res) => {
    User.findAll({
        // do not return password
        attributes: ['login', 'firstname', 'lastname', 'email', 'phone', 'birth'],
        limit: req.query.limit || 100,
        offset: req.query.offset || 0
    }).then(data => {
        res.status(200).json({
            users: data
        });
    });
});

// GET api/users/:login
router.get('/:login', (req, res) => {
    const login = req.params.login;
    User.findAll({
        // do not return password
        attributes: ['login', 'firstname', 'lastname', 'email', 'phone', 'birth'],
        where: {
            login: login
        }
    }).then(data => {
        res.status(200).json({
            user: data
        });
    })
});

// GET api/users/:login/comments
router.get('/:login/comments', (req, res) => {
    const login = req.params.login;
    Comment.findAll({
        attributes: ['commentid', 'title', 'description', 'date'],
        include: [{
            model: Movie,
            attributes: ['title', 'name',  'director', 'genre', 'rating', 'releasedate', 'duration'],
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
        res.status(200).json({
            comments: data
        });
    });
});

// GET api/users/:login/ratings
router.get('/:login/ratings', (req, res) => {
    const login = req.params.login;
    Rating.findAll({
        attributes: ['ratingid', 'stars', 'date'],
        include: [{
            model: Movie,
            attributes: ['title', 'name', 'director', 'genre', 'rating', 'releasedate', 'duration'],
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
        res.status(200).json({
            ratings: data
        })
    });
});

// POST api/users
router.post('/', (req, res) => {
    User.create({
        login: req.body.login,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        birth: req.body.birth,
    }).then((data) => {
        res.status(201).json({
            user: data
        });
    }).catch((err) => {
        res.status(400).json({
            response: err
        });
    });
});

// PUT api/users/:id
router.put('/:id', (req, res) => {
    const id = req.params.id;
    User.update({
        login: req.body.login,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        birth: req.body.birth,
    },  {
        where: {
            userid: id
        }
    }).then(() => {
        res.status(200).json({
            message: 'User has been updated!'
        });
    }).catch((err)=>{
        res.status(400).json({
            message: err
        });
    });
});

// DELETE api/users/:id
router.delete('/:id', (req, res) => {
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
        res.status(400).json({
            message: err
        });
    });
});

module.exports = router;