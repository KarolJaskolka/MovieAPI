const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');

// GET api/ratings?limit=100&offset=0
router.get('/', (req, res) => {
    Rating.findAll({
        limit: req.query.limit || 100,
        offset: req.query.offset || 0
    })
    .then(data => {
        res.status(200).json({
            ratings: data
        })
    })
})

// POST api/ratings
router.post('/', (req, res) => {
    Rating.create({
        userid: req.body.userid,
        movieid: req.body.movieid,
        stars: req.body.stars,
        date: new Date()
    }).then((data)=>{
        res.status(201).json({
            rating: data
        })
    }).catch((err)=>{
        res.status(400).json({
            message: err
        })
    });
})

// PATCH api/ratings/:id
router.patch('/:id', (req, res) => {
    const id = req.params.id;
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
        res.status(400).json({
            message: err
        })
    });
})

// DELETE api/ratings/:id
router.delete(':id', (req, res) => {
    const id = req.params.id;
    Rating.destroy({
        where: {
            ratingid: id
        }
    }).then(() => {
        res.status(200).json({
            message: 'Rating has been removed'
        })
    }).catch((err) => {
        res.status(400).json({
            message: err
        })
    });
})

module.exports = router;