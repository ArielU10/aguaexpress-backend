const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

// 🔓 Ruta pública para login con Google y Facebook
router.post('/google-login', userController.googleLogin);
router.post('/facebook-login', userController.facebookLogin);

// 🔓 Ruta pública para registro manual
router.post('/', userController.registerUser);

// 🔐 Rutas protegidas (solo admin)
router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.get('/me', verifyToken, userController.me);


module.exports = router;
