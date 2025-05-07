const express = require('express');
const router = express.Router();
const { loginUser, loginTeacher, loginContact, verifyToken, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../../middleware/auth');

// Rutas de autenticación
router.post('/login/user', loginUser);
router.post('/login/teacher', loginTeacher);
router.post('/login/contact', loginContact);
router.post('/verify-token', verifyToken);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
