const User = require('../models/User');
const bcrypt = require('bcrypt');

// Crear usuario (registro)
exports.registerUser = async (req, res) => {
  try {
    const { fullName, phone, address, email, password, role } = req.body;

    if (!fullName || !phone || !address || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      phone,
      address,
      email,
      password: hashedPassword,
      role: role || 'client'
    });

    res.status(201).json({ message: 'Usuario registrado correctamente', user });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const { fullName, phone, address, email, password, role } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    await user.update({
      fullName: fullName || user.fullName,
      phone: phone || user.phone,
      address: address || user.address,
      email: email || user.email,
      password: hashedPassword,
      role: role || user.role
    });

    res.json({ message: 'Usuario actualizado', user });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
