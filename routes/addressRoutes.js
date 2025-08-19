const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const verifyToken = require('../middlewares/verifyToken');

// POST / → Crear nueva dirección
router.post('/', verifyToken, addressController.createAddress);

// GET / → Obtener direcciones del usuario autenticado
router.get('/', verifyToken, addressController.getMyAddresses);

// GET /:id → Obtener dirección por ID
router.get('/:id', verifyToken, addressController.getAddressById);

// PUT /:id → Actualizar dirección por ID
router.put('/:id', verifyToken, addressController.updateAddress);

// DELETE /:id → Eliminar dirección por ID
router.delete('/:id', verifyToken, addressController.deleteAddress);

module.exports = router;
