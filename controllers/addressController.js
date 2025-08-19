const Address = require('../models/addressModel');
const User = require('../models/userModel');

// Crear una nueva dirección para un usuario
exports.createAddress = async (req, res) => {
  try {
    const {
      mainStreet,
      secondaryStreet,
      reference,
      label,
      latitude,
      longitude,
      sector // 👈 nuevo campo
    } = req.body;

    const userId = req.user.id;

    if (!mainStreet || latitude == null || longitude == null) {
      return res.status(400).json({ message: 'Calle principal y ubicación son obligatorias' });
    }

    const newAddress = await Address.create({
      mainStreet,
      secondaryStreet,
      reference,
      label,
      latitude,
      longitude,
      sector,
      userId
    });

    res.status(201).json({ message: 'Dirección registrada', address: newAddress });
  } catch (error) {
    console.error('Error al registrar dirección:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



// Obtener todas las direcciones del usuario autenticado
exports.getMyAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.findAll({ where: { userId } });
    res.json(addresses);
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener una dirección por ID
exports.getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findByPk(id);
    if (!address) return res.status(404).json({ message: 'Dirección no encontrada' });

    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta dirección' });
    }

    res.json(address);
  } catch (error) {
    console.error('Error al obtener dirección:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar una dirección
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findByPk(id);
    if (!address) return res.status(404).json({ message: 'Dirección no encontrada' });

    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta dirección' });
    }

    await address.update(req.body);
    res.json({ message: 'Dirección actualizada', address });
  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar una dirección
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findByPk(id);
    if (!address) return res.status(404).json({ message: 'Dirección no encontrada' });

    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta dirección' });
    }

    await address.destroy();
    res.json({ message: 'Dirección eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar dirección:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
