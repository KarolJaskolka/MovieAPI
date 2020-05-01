const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// POST api/auth/login
router.post('/login', authController.login);

// POST api/auth/token
router.post('/token', authController.refreshToken);

module.exports = router;