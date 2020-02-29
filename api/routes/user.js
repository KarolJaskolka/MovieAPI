const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const Rating = require('../models/rating');
const multer = require('multer');
const checkToken = require('../token/checkToken');
const bcrypt = require('bcrypt');

// GET api/users?limit=100&offset=0
router.get('/', (req, res) => {
    User.findAll({
        // do not return password
        attributes: ['login', 'firstname', 'lastname', 'email', 'phone', 'birth', 'avatar'],
        limit: req.query.limit || 100,
        offset: req.query.offset || 0
    }).then(data => {
        res.status(200).json(data);
    });
});

// GET api/users/:login
router.get('/:login', (req, res) => {
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
});

// GET api/users/:login/comments
router.get('/:login/comments', (req, res) => {
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
});

// GET api/users/:login/ratings?orderBy=
router.get('/:login/ratings', (req, res) => {
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
});

// GET api/users/:userid/ratings/:movieid
router.get('/:userid/ratings/:movieid', (req, res) => {
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
});

// POST api/users
router.post('/', (req, res) => {
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
});

const storageOpt = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './api/images/users/');
    },
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, '-'); 
        cb(null, date + file.originalname);
    }
})

const upload = multer({storage: storageOpt});

// POST api/users/avatars
router.post('/avatars', checkToken, upload.single('avatar'), (req, res) => {
    const login = req.body.login;
    User.update({
        avatar: req.file.path
    },{
        where: {
            login: login
        }
    }).then(()=>{
        res.status(201).json({
            message: 'File has been sent'
        })
    }).catch((err)=>{
        res.status(500).json({
            message: err
        })
    })
});

// PUT api/users/:id
router.put('/:id', checkToken, (req, res) => {
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
});

// DELETE api/users/:id
router.delete('/:id', checkToken, (req, res) => {
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
});

module.exports = router;