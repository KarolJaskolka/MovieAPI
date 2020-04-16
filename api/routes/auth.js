const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let tokenList = [] // just for now

// POST api/auth/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            login: req.body.login,
        }
    }).then(data => {
        if(data){
            bcrypt.compare(req.body.password, data.password, (error, result) => {
                if(error){
                    res.status(400).json({
                        message: 'Validation failed'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        login: data.login
                    },
                        process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: '1h'
                    })
                    const refreshToken = jwt.sign({
                        login: data.login
                    }, 
                        process.env.JWT_SECRET_REFRESH_KEY, 
                    { 
                        expiresIn: '1d'
                    })
                    tokenList.push(refreshToken);
                    res.status(200).json({
                        userid: data.userid,
                        login: data.login,
                        token: token,
                        refreshToken: refreshToken
                    })
                } else{
                    res.status(400).json({
                        message: 'Validation failed'
                    })
                }
            })
        } else{
            res.status(400).json({
                message: 'Validation failed'
            })
        }
    })
})


router.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const login = req.body.login;

    if(tokenList.includes(refreshToken)){
        try{
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_KEY);
            const token = jwt.sign({
                login: login
            },
                process.env.JWT_SECRET_KEY,
            {
                expiresIn: '1h'
            })
            res.status(200).json({
                token: token
            })
        } catch(err){
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
    }
    else{
        res.status(403).json({
            message: 'Forbidden'
        })
    }

})

module.exports = router;