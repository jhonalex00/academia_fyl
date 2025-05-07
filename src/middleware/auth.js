const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'academia-fyl-secret-key';

// Middleware para autenticar usuarios a través de JWT
exports.authenticate = (req, res, next) => {
  // Obtener el token del header Authorization (Bearer token)
  const token = req.headers.authorization?.split(' ')[1] || req.header('x-auth-token');

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, token no proporcionado'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Añadir el usuario del payload decodificado al objeto request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    res.status(401).json({
      success: false,
      message: 'Token no válido o expirado'
    });
  }
};

// Middleware para autorizar roles específicos
exports.authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    // Asumimos que authenticate ya se ejecutó antes y req.user está configurado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, debe autenticarse primero'
      });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'No tiene permisos para realizar esta acción' 
      });
    }
    next();
  };
};