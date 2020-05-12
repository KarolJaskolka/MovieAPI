const Comment = require('../models/comment');
const User = require('../models/user');
const Movie = require('../models/movie');

exports.getComments = (req, res) => {
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
        res.status(200).json(data)
    })
}

exports.getCommentById = (req, res) => {
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
        res.status(200).json(data)
    });
}

exports.addComment = (req, res) => {
    Comment.create({
        userid: req.userId,
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
}

exports.updateCommment = async (req, res) => {
    const id = req.params.id;
    
    try {
        const comment = await Comment.findOne({
            where: {
                commentid: id
            }
        })
        if (comment.userId != req.userId) {
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
        else{
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
        }
    } catch (e) {
        res.status(500).json({
            message: e
        })
    }
    
}

exports.deleteComment = async (req, res) => {
    
    const id = req.params.id;

    try {
        const comment = await Comment.findOne({
            where: {
                commentid: id
            }
        })
        if (comment.userId != req.userId) {
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
        else{
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
        }
    } catch (e) {
        res.status(500).json({
            message: e
        })
    }
}