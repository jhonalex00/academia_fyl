const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/estudianteController');

// Obtener todos los estudiantes
router.get('/', getStudents);

// Obtener un estudiante por ID
router.get('/:id', getStudentById);

// Crear un nuevo estudiante
router.post('/', createStudent);

// Actualizar un estudiante existente
router.put('/:id', updateStudent);

// Eliminar un estudiante
router.delete('/:id', deleteStudent);

module.exports = router;