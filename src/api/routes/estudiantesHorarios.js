const express = require('express');
const router = express.Router();
const { getStudentSchedules, createStudentSchedule, deleteStudentSchedule } = require('../controllers/estudianteHorarioController');

// Obtener todos los horarios de estudiantes
router.get('/', getStudentSchedules);

// Crear una nueva relación estudiante-horario
router.post('/', createStudentSchedule);

// Eliminar una relación estudiante-horario
router.delete('/:idstudent/:idschedule', deleteStudentSchedule);

module.exports = router;