const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const User = require('../models/user');
const Movie = require('../models/movie');
const checkToken = require('../token/checkToken');

// GET api/comments?limit=100&offset=0
router.get('/', (req, res) => {
    Comment.findAll({
        attributes: ['commentid', 'title', 'description', 'date', 'threadid'],
        include: [{
            model: User,
            attributes: ['login'],
            required: true,
        },{
            model: Movie,
            attributes: ['title', 'name'],
            required: true,
        }],
        limit: req.query.limit || 100,
        offset: req.query.offset || 0
    })
    .then(data => {
        res.status(200).json({
            comments: data
        })
    })
})

// GET api/comments/:id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Comment.findByPk(id, {
        attributes: ['commentid', 'title', 'description', 'date', 'threadid'],
        include: [{
            model: User,
            attributes: ['login'],
            required: true,
        },{
            model: Movie,
            attributes: ['title', 'name'],
            required: true,
        }]
    })
    .then((data) => {
        res.status(200).json({
            comment: data
        })
    });
})

// POST api/comments
router.post('/', checkToken, (req, res) => {
    Comment.create({
        userid: req.body.userid,
        movieid: req.body.movieid,
        threadid: req.body.threadid,
        title: req.body.title,
        description: req.body.description,
        date: new Date()
    }).then((data)=>{
        res.status(201).json({
            comment: data
        })
    }).catch((err)=>{
        res.status(500).json({
            message: err
        })
    });
})

// PATCH api/comments/:id
router.patch('/:id', checkToken, (req, res) => {
    const id = req.params.id;
    Comment.update({
        title: req.body.title,
        description: req.body.description,
        date: new Date()
    },{
        where: {
            commentid: id
        }
    }).then(()=>{
        res.status(200).json({
            message: 'Comment has been updated'
        })
    }).catch((err)=>{
        res.status(500).json({
            message: err
        })
    });
})

// DELETE api/comments/:id
router.delete(':id', checkToken, (req, res) => {
    const id = req.params.id;
    Comment.destroy({
        where: {
            commentid: id
        }
    }).then(() => {
        res.status(200).json({
            message: 'Comment has been removed'
        })
    }).catch((err) => {
        res.status(500).json({
            message: err
        })
    });
})

module.exports = router;