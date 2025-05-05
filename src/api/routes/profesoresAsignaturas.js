const express = require('express');
const router = express.Router();
const { getTeacherSubjects, getTeacherSubjectsByTeacher, createTeacherSubject, deleteTeacherSubject } = require('../controllers/profesorAsignaturaController');

// Obtener todas las asignaturas de profesores
router.get('/', getTeacherSubjects);

// Obtener las asignaturas de un profesor específico
router.get('/:id', getTeacherSubjectsByTeacher);

// Crear una nueva relación profesor-asignatura
router.post('/', createTeacherSubject);

// Eliminar una relación profesor-asignatura
router.delete('/:idteacher/:idsubject', deleteTeacherSubject);

module.exports = router;