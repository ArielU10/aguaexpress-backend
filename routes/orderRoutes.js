const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// -------------------- RUTAS PROTEGIDAS --------------------

// Cliente: Crear nuevo pedido
router.post('/orders', verifyToken, orderController.createOrder);

// Cliente: Ver pedidos propios
router.get('/orders/client/:id', verifyToken, orderController.getOrdersByClient);

// Admin: Ver todos los pedidos
router.get('/orders', verifyToken, isAdmin, orderController.getAllOrders);

// Admin: Actualizar estado del pedido
router.put('/orders/:id', verifyToken, isAdmin, orderController.updateOrderStatus);

// Admin: Eliminar un pedido
router.delete('/orders/:id', verifyToken, isAdmin, orderController.deleteOrder);

module.exports = router;
