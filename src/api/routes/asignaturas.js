const express = require('express');
const router = express.Router();
const { 
  getAsignaturas, 
  getAsignaturaById, 
  createAsignatura, 
  updateAsignatura, 
  deleteAsignatura 
} = require('../controllers/asignaturaController');
const authMiddleware = require('../../middleware/auth');

// Rutas para asignaturas
// GET /api/asignaturas - Obtener todas las asignaturas
router.get('/', authMiddleware, getAsignaturas);

// GET /api/asignaturas/:id - Obtener una asignatura por ID
router.get('/:id', authMiddleware, getAsignaturaById);

// POST /api/asignaturas - Crear una nueva asignatura
router.post('/', authMiddleware, createAsignatura);

// PUT /api/asignaturas/:id - Actualizar una asignatura
router.put('/:id', authMiddleware, updateAsignatura);

// DELETE /api/asignaturas/:id - Eliminar una asignatura
router.delete('/:id', authMiddleware, deleteAsignatura);

module.exports = router;