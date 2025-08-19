module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'cliente') {
      next();
    } else {
      return res.status(403).json({ message: 'Acceso denegado. Solo clientes autorizados.' });
    }
  };
  