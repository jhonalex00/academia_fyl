const express = require('express');
const router = express.Router();
const { 
  getHorarios, 
  getHorarioById, 
  createHorario, 
  updateHorario, 
  deleteHorario 
} = require('../controllers/horarioController');
const authMiddleware = require('../../middleware/auth');

// Rutas para horarios
// GET /api/horarios - Obtener todos los horarios
router.get('/', authMiddleware, getHorarios);

// GET /api/horarios/:id - Obtener un horario por ID
router.get('/:id', authMiddleware, getHorarioById);

// POST /api/horarios - Crear un nuevo horario
router.post('/', authMiddleware, createHorario);

// PUT /api/horarios/:id - Actualizar un horario
router.put('/:id', authMiddleware, updateHorario);

// DELETE /api/horarios/:id - Eliminar un horario
router.delete('/:id', authMiddleware, deleteHorario);

module.exports = router;