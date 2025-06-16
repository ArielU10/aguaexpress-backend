const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso restringido solo para administradores' });
    }
    next();
  };
  
  module.exports = isAdmin;
  