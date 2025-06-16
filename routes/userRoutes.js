const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// Rutas públicas
router.post('/users/register', userController.registerUser);

// Rutas protegidas (solo admin)
router.get('/users', verifyToken, isAdmin, userController.getAllUsers);
router.get('/users/:id', verifyToken, isAdmin, userController.getUserById);
router.put('/users/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/users/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
