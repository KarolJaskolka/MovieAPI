const User = require('../models/user');

exports.uploadAvatar = (req, res) => {
    User.update({
        avatar: req.file.path
    },{
        where: {
            userid: req.userId
        }
    }).then(()=>{
        res.status(201).json({
            message: 'Avatar has been uploaded'
        })
    }).catch((err)=>{
        res.status(500).json({
            message: err
        })
    })
}