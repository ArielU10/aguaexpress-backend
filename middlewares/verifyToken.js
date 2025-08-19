const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 AUTH HEADER:", authHeader); // Agrega esto

  const token = authHeader?.split(' ')[1];
  if (!token) {
    console.log("🚫 Token no proporcionado");
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("✅ Token válido, payload:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token inválido:", err.message);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
