const User = require('../models/user');

exports.uploadAvatar = (req, res) => {
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
}