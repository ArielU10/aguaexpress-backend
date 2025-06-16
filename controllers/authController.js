const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar existencia de usuario
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Crear token
    const token = jwt.sign(
      { id: user.id, role: user.role, fullName: user.fullName },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    // Responder con datos del usuario (sin contraseña) + token
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
