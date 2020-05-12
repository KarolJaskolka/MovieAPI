const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
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
                        login: data.login,
                        userid: data.userid
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
                    RefreshToken
                        .create({token: refreshToken})
                        .then(()=>{
                            res.status(200).json({
                                token: token,
                                refreshToken: refreshToken
                            })
                        })
                        .catch((err)=>{
                            res.status(500).json(err);
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
}

exports.register = (req, res) => {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (!error){
            User.create({
                login: req.body.login,
                password: hash,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
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

exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    const login = req.body.login;
    
    let user;
    try {
        user = await User.findOne({where: {login: login}})
    } catch(err){
        res.status(500).json(err);
    }

    RefreshToken.findOne({
        where: {
            token: refreshToken
        }
    }).then(()=>{
        try{
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_KEY);
            const token = jwt.sign({
                login: login,
                userid: user.userid
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
    })
    .catch(err=>{
        res.status(403).json({
            message: 'Forbidden'
        })
    })

}