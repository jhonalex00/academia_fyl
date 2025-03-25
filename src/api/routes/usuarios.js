const express = require('express');
const router = express.Router();
const { 
  getUsuarios, 
  getUsuarioById, 
  createUsuario, 
  loginUsuario,
  updateUsuario, 
  deleteUsuario 
} = require('../controllers/usuarioController');
const authMiddleware = require('../../middleware/auth');

// Rutas públicas (sin autenticación)
// POST /api/usuarios/registro - Registrar un nuevo usuario
router.post('/registro', createUsuario);

// POST /api/usuarios/login - Autenticar un usuario
router.post('/login', loginUsuario);

// Rutas protegidas (requieren autenticación)
// GET /api/usuarios - Obtener todos los usuarios
router.get('/', authMiddleware, getUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', authMiddleware, getUsuarioById);

// PUT /api/usuarios/:id - Actualizar un usuario
router.put('/:id', authMiddleware, updateUsuario);

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', authMiddleware, deleteUsuario);

module.exports = router;