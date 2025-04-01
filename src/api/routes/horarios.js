const express = require('express');
const router = express.Router();
const { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/horarioController');

// Obtener todos los horarios
router.get('/', getSchedules);

// Obtener un horario por ID
router.get('/:id', getScheduleById);

// Crear un nuevo horario
router.post('/', createSchedule);

// Actualizar un horario existente
router.put('/:id', updateSchedule);

// Eliminar un horario
router.delete('/:id', deleteSchedule);

module.exports = router;