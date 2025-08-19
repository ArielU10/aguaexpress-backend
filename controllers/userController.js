const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

// Crear usuario (registro)
exports.registerUser = async (req, res) => {
  try {
    const { fullName, phone, email, password, role, cedula } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
    }

    if (cedula) {
      const existingCedula = await User.findOne({ where: { cedula } });
      if (existingCedula) {
        return res.status(409).json({ message: 'La cédula ya está registrada' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName || null,
      phone: phone || null,
      email,
      password: hashedPassword,
      role: role || 'client',
      cedula: cedula || null
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
    const { fullName, phone, email, password, role, cedula, gender, birthDate } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Unicidad email/cedula
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail && existingEmail.id_user !== user.id_user) {
        return res.status(409).json({ message: 'El correo electrónico ya está en uso por otro usuario' });
      }
    }
    if (cedula && cedula !== user.cedula) {
      const existingCedula = await User.findOne({ where: { cedula } });
      if (existingCedula && existingCedula.id_user !== user.id_user) {
        return res.status(409).json({ message: 'La cédula ya está en uso por otro usuario' });
      }
    }

    // Validaciones específicas
    const ALLOWED_GENDERS = ['Masculino', 'Femenino', 'Prefiero no Decirlo', 'Otro'];
    if (gender !== undefined && gender !== null && !ALLOWED_GENDERS.includes(gender)) {
      return res.status(400).json({ message: 'Género inválido' });
    }
    if (birthDate !== undefined && birthDate !== null) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(birthDate))) {
        return res.status(400).json({ message: 'birthDate debe ser YYYY-MM-DD' });
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    await user.update({
      fullName:   fullName   ?? user.fullName,
      phone:      phone      ?? user.phone,
      email:      email      ?? user.email,
      password:   hashedPassword,
      role:       role       ?? user.role,
      cedula:     cedula     ?? user.cedula,
      gender:     gender     ?? user.gender,      // 👈 ahora sí se guarda
      birthDate:  birthDate  ?? user.birthDate    // 👈 ahora sí se guarda
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

// Login o registro automático con Google
exports.googleLogin = async (req, res) => {
  const { email, fullName, cedula } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      if (user.role !== 'client') {
        return res.status(403).json({
          message: 'Este correo ya está registrado con otro rol y no puede usar el inicio de sesión con Google.'
        });
      }
    } else {
      user = await User.create({
        fullName,
        email,
        role: 'client',
        cedula: cedula || null
      });
    }

    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      user: {
        id: user.id_user,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Error en login con Google:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Login o registro automático con Facebook
exports.facebookLogin = async (req, res) => {
  const { email, fullName, cedula } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        fullName,
        email,
        role: 'client',
        cedula: cedula || null
      });
    }

    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      user: {
        id: user.id_user,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Error en login con Facebook:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// controllers/userController.js
exports.me = async (req, res) => {
  try {
    const { id_user, id } = req.user || {};
    const userId = id_user || id;
    if (!userId) return res.status(401).json({ message: 'Token inválido' });

    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const profileCompleted = Boolean(
      user.fullName && user.phone && user.gender && user.birthDate
    );

    res.json({
      id_user: user.id_user,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      cedula: user.cedula,
      gender: user.gender,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profileCompleted
    });
  } catch (e) {
    console.error('Error en /users/me:', e);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
