const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtener el token del header
  const token = req.header('x-auth-token');

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No hay token, autorización denegada'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    
    // Añadir el usuario del payload decodificado al objeto request
    req.usuario = decoded.usuario;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token no válido'
    });
  }
};

module.exports = authMiddleware;