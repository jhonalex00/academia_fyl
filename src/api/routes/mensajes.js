const express = require('express');
const router = express.Router();
const { getMessages, getMessageById, createMessage, updateMessage, deleteMessage } = require('../controllers/mensajeController');

// Obtener todos los mensajes
router.get('/', getMessages);

// Obtener un mensaje por ID
router.get('/:id', getMessageById);

// Crear un nuevo mensaje
router.post('/', createMessage);

// Actualizar un mensaje existente
router.put('/:id', updateMessage);

// Eliminar un mensaje
router.delete('/:id', deleteMessage);

module.exports = router;