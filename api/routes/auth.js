const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// POST api/auth/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            login: req.body.login,
            password: req.body.password
        }
    }).then(data => {
        if(data){
            const token = jwt.sign({
                userid: data.userid,
                login: data.login
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '2h'
            })
            res.status(200).json({
                userid: data.userid,
                login: data.login,
                token: token
            })
        }
        else{
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
    })
})

module.exports = router;