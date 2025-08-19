// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');
// const isAdmin = require('../middlewares/isAdmin'); // si manejas roles

// Crear producto
router.post('/', verifyToken, /* isAdmin, */ productController.createProduct);

// Listar productos (con filtros/paginación)
router.get('/', verifyToken, productController.getAllProducts);

// Obtener producto por ID
router.get('/:id', verifyToken, productController.getProductById);

// Actualizar producto
router.put('/:id', verifyToken, /* isAdmin, */ productController.updateProduct);

// Eliminar producto
router.delete('/:id', verifyToken, /* isAdmin, */ productController.deleteProduct);

// Activar / desactivar producto
router.patch('/:id/active', verifyToken, /* isAdmin, */ productController.toggleActive);

// Actualizar stock rápidamente
router.patch('/:id/stock', verifyToken, /* isAdmin, */ productController.updateStock);

module.exports = router;
