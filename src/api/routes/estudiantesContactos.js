const express = require('express');
const router = express.Router();
const { getStudentContacts, createStudentContact, deleteStudentContact } = require('../controllers/estudianteContactoController');

// Obtener todos los contactos de estudiantes
router.get('/', getStudentContacts);

// Crear una nueva relación estudiante-contacto
router.post('/', createStudentContact);

// Eliminar una relación estudiante-contacto
router.delete('/:idstudent/:idcontact', deleteStudentContact);

module.exports = router;