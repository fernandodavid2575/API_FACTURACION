const isAdmin = (req, res, next) => {
  if (req.user && req.user.nombre_rol === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado: se requiere rol ADMIN' });
};

// Verifica que el usuario tenga alguno de los roles indicados
const hasRole = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.nombre_rol)) {
    return next();
  }
  return res.status(403).json({
    message: `Acceso denegado: se requiere uno de los roles [${roles.join(', ')}]`
  });
};

module.exports = { isAdmin, hasRole };
