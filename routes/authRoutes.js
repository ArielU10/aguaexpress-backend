const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.login);

// Login con Firebase
router.post('/firebase-login', authController.firebaseLogin);

module.exports = router;
