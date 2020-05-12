const Rating = require('../models/rating');
const User = require('../models/user');
const Movie = require('../models/movie');

exports.getRatings = (req, res) => {
    Rating.findAll({
        attributes:['ratingid','stars','date'],
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

exports.getRatingById = (req, res) => {
    const id = req.params.id;
    Rating.findByPk(id, {
        attributes:['ratingid','stars','date'],
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

exports.addRating = (req, res) => {
    Rating.create({
        userid: req.userId,
        movieid: req.body.movieid,
        stars: req.body.stars,
        date: new Date()
    }).then((data)=>{
        res.status(201).json({
            rating: data
        })
    }).catch((err)=>{
        res.status(500).json({
            message: err
        })
    });
}

exports.updateRating = async (req, res) => {
    const id = req.params.id;

    try {
        const rating = await Rating.findOne({
            where: {
                ratingid: id
            }
        })
        if(rating.userid != req.userId){
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
        else{
            Rating.update({
                stars: req.body.stars,
                date: new Date()
            },{
                where: {
                    ratingid: id
                }
            }).then(()=>{
                res.status(200).json({
                    message: 'Rating has been updated'
                })
            }).catch((err)=>{
                res.status(500).json({
                    message: err
                })
            });
        }
    } catch(e) {
        res.status(500).json({
            message: e
        })
    }
}

exports.deleteRating = async (req, res) => {
    const id = req.params.id;

    try {
        const rating = await Rating.findOne({
            where: {
                ratingid: id
            }
        })
        if(rating.userid != req.userId){
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
        else{
            Rating.destroy({
                where: {
                    ratingid: id
                }
            }).then(() => {
                res.status(200).json({
                    message: 'Rating has been removed'
                })
            }).catch((err) => {
                res.status(500).json({
                    message: err
                })
            });
        }
    } catch(e) {
        res.status(500).json({
            message: e
        })
    }
}
