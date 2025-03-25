const express = require('express');
const router = express.Router();
const { 
  getProfesores, 
  getProfesorById, 
  createProfesor, 
  updateProfesor, 
  deleteProfesor 
} = require('../controllers/profesorController');
const authMiddleware = require('../../middleware/auth');

// Rutas para profesores
// GET /api/profesores - Obtener todos los profesores
router.get('/', authMiddleware, getProfesores);

// GET /api/profesores/:id - Obtener un profesor por ID
router.get('/:id', authMiddleware, getProfesorById);

// POST /api/profesores - Crear un nuevo profesor
router.post('/', authMiddleware, createProfesor);

// PUT /api/profesores/:id - Actualizar un profesor
router.put('/:id', authMiddleware, updateProfesor);

// DELETE /api/profesores/:id - Eliminar un profesor
router.delete('/:id', authMiddleware, deleteProfesor);

module.exports = router;