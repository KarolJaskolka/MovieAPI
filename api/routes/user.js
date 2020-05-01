const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const uploadController = require('../controllers/upload');

const multer = require('multer');
const checkToken = require('../middleware/checkToken');


// GET api/users?limit=100&offset=0
router.get('/', userController.getUsers);

// GET api/users/:login
router.get('/:login', userController.getUserByLogin);

// GET api/users/:login/comments
router.get('/:login/comments', userController.getUserComments);

// GET api/users/:login/ratings?orderBy=
router.get('/:login/ratings', userController.getUserRatings);

// GET api/users/:userid/ratings/:movieid
router.get('/:userid/ratings/:movieid', userController.getUserRatingByMovieId);

// POST api/users
router.post('/', userController.addUser);

// PUT api/users/:id
router.put('/:id', checkToken, userController.updateUser);

// DELETE api/users/:id
router.delete('/:id', checkToken, userController.deleteUser);

const storageOpt = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './api/images/users/');
    },
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, '-'); 
        cb(null, date + file.originalname);
    }
})

const upload = multer({storage: storageOpt});

// POST api/users/avatars
router.post('/avatars', checkToken, upload.single('avatar'), uploadController.uploadAvatar);

module.exports = router;