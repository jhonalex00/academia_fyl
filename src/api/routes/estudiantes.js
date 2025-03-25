const express = require('express');
const router = express.Router();
const { 
  getEstudiantes, 
  getEstudianteById, 
  createEstudiante, 
  updateEstudiante, 
  deleteEstudiante 
} = require('../controllers/estudianteController');
const authMiddleware = require('../../middleware/auth');

// Rutas para estudiantes
// GET /api/estudiantes - Obtener todos los estudiantes
router.get('/', authMiddleware, getEstudiantes);

// GET /api/estudiantes/:id - Obtener un estudiante por ID
router.get('/:id', authMiddleware, getEstudianteById);

// POST /api/estudiantes - Crear un nuevo estudiante
router.post('/', authMiddleware, createEstudiante);

// PUT /api/estudiantes/:id - Actualizar un estudiante
router.put('/:id', authMiddleware, updateEstudiante);

// DELETE /api/estudiantes/:id - Eliminar un estudiante
router.delete('/:id', authMiddleware, deleteEstudiante);

module.exports = router;