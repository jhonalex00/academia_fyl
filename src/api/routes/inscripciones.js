const express = require('express');
const router = express.Router();
const { getEnrolments, getEnrolmentById, createEnrolment, updateEnrolment, deleteEnrolment } = require('../controllers/inscripcionController');

// Obtener todas las inscripciones
router.get('/', getEnrolments);

// Obtener una inscripción por ID
router.get('/:id', getEnrolmentById);

// Crear una nueva inscripción
router.post('/', createEnrolment);

// Actualizar una inscripción existente
router.put('/:id', updateEnrolment);

// Eliminar una inscripción
router.delete('/:id', deleteEnrolment);

module.exports = router;