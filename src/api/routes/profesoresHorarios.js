const express = require('express');
const router = express.Router();
const { getTeacherSchedules, createTeacherSchedule, deleteTeacherSchedule } = require('../controllers/profesorHorarioController');

// Obtener todos los horarios de profesores
router.get('/', getTeacherSchedules);

// Crear una nueva relación profesor-horario
router.post('/', createTeacherSchedule);

// Eliminar una relación profesor-horario
router.delete('/:idteacher/:idschedule', deleteTeacherSchedule);

module.exports = router;