const express = require('express');
const router = express.Router();
const { getContacts, getContactById, createContact, updateContact, deleteContact } = require('../controllers/contactoController');

// Obtener todos los contactos
router.get('/', getContacts);

// Obtener un contacto por ID
router.get('/:id', getContactById);

// Crear un nuevo contacto
router.post('/', createContact);

// Actualizar un contacto existente
router.put('/:id', updateContact);

// Eliminar un contacto
router.delete('/:id', deleteContact);

module.exports = router;