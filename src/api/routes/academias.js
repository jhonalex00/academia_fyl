const express = require('express');
const router = express.Router();
const { getAcademies, getAcademyById, createAcademy, updateAcademy, deleteAcademy } = require('../controllers/academiaController');

// Obtener todas las academias
router.get('/', getAcademies);

// Obtener una academia por ID
router.get('/:id', getAcademyById);

// Crear una nueva academia
router.post('/', createAcademy);

// Actualizar una academia existente
router.put('/:id', updateAcademy);

// Eliminar una academia
router.delete('/:id', deleteAcademy);

module.exports = router;