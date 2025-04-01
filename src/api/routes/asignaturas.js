const express = require('express');
const router = express.Router();
const { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } = require('../controllers/asignaturaController');

// Obtener todas las asignaturas
router.get('/', getSubjects);

// Obtener una asignatura por ID
router.get('/:id', getSubjectById);

// Crear una nueva asignatura
router.post('/', createSubject);

// Actualizar una asignatura existente
router.put('/:id', updateSubject);

// Eliminar una asignatura
router.delete('/:id', deleteSubject);

module.exports = router;