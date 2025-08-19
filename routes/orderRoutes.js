// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/verifyToken');

// Cliente: Crear nuevo pedido
router.post('/', verifyToken, orderController.createOrder);

// Cliente: Ver pedidos propios
router.get('/client', verifyToken, orderController.getOrdersByClient);

// Admin: Ver todos los pedidos
router.get('/', verifyToken, orderController.getAllOrders);

// (Opcional) Admin/Cliente: Ver un pedido por id
router.get('/:id', verifyToken, orderController.getOrderById);

// Admin: Actualizar estado del pedido
router.put('/:id', verifyToken, orderController.updateOrderStatus);

// Admin: Eliminar un pedido
router.delete('/:id', verifyToken, orderController.deleteOrder);

module.exports = router;
