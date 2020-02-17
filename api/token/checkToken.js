const jwt = require('jsonwebtoken');

checkToken = (req, res, next) => {
    try{
        // Bearer token
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userData = decoded;
        next();
    } catch(err){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
};

module.exports = checkToken;