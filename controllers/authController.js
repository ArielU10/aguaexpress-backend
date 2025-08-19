const User = require('../models/userModel');
const Address = require('../models/addressModel'); // 👈 necesario para contar direcciones
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('../utils/firebaseService'); // Firebase Admin
require('dotenv').config();

// Construye el payload de usuario que enviamos al cliente
const buildUserPayload = (user) => ({
  id: user.id_user,            // 👈 PK correcta
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  cedula: user.cedula,
  gender: user.gender,
  birthDate: user.birthDate
});

// Calcula si el perfil está completo (datos + al menos 1 dirección)
const computeProfileCompleted = async (user) => {
  const addressesCount = await Address.count({ where: { id_user: user.id_user } });
  return Boolean(
    user.phone &&
    user.cedula &&
    user.gender &&
    user.birthDate &&
    addressesCount > 0
  );
};

// ---------------- Login tradicional ----------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, user.password || '');
    if (!validPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id_user, role: user.role, fullName: user.fullName }, // 👈 id_user
      process.env.SECRET_KEY,
      { expiresIn: '7d' } // puedes usar '1d' si prefieres
    );

    const profileCompleted = await computeProfileCompleted(user);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: buildUserPayload(user),
      profileCompleted                    // 👈 bandera que lee Android
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// ---------------- Login con Firebase ----------------
exports.firebaseLogin = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'Falta el idToken' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;
    const fullName =
      decodedToken.name ||
      decodedToken.displayName ||
      'Sin Nombre';

    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Crea usuario mínimo; no enviamos 'provider' si no existe en el modelo
      user = await User.create({
        fullName,
        email,
        password: null,
        role: 'client'
      });
    }

    const token = jwt.sign(
      { id: user.id_user, role: user.role, fullName: user.fullName }, // 👈 id_user
      process.env.SECRET_KEY,
      { expiresIn: '7d' }
    );

    const profileCompleted = await computeProfileCompleted(user);

    res.json({
      token,
      user: buildUserPayload(user),
      profileCompleted                    // 👈 lo usará LoginActivity
    });
  } catch (error) {
    console.error('Error en Firebase Login:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
