const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middleware/auth');

// Importar todas las rutas
const authRoutes = require('./auth');
const estudiantesRoutes = require('./estudiantes');
const profesoresRoutes = require('./profesores');
const asignaturasRoutes = require('./asignaturas');
const horariosRoutes = require('./horarios');
const usuariosRoutes = require('./usuarios');
const academiasRoutes = require('./academias');
const contactosRoutes = require('./contactos');
const profesoresHorariosRoutes = require('./profesoresHorarios');
const estudiantesHorariosRoutes = require('./estudiantesHorarios');
const dashboardRoutes = require('./dashboard');

// Rutas públicas (sin autenticación)
router.use('/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
router.use('/estudiantes', authenticate, estudiantesRoutes);
router.use('/profesores', authenticate, profesoresRoutes);
router.use('/asignaturas', authenticate, asignaturasRoutes);
router.use('/horarios', authenticate, horariosRoutes);
// Para rutas con autorización de roles específicos
const adminOnly = authorize(['admin']);
router.use('/usuarios', authenticate, adminOnly, usuariosRoutes);
router.use('/academias', authenticate, academiasRoutes);
router.use('/contactos', authenticate, contactosRoutes);
router.use('/profesores/horarios', authenticate, profesoresHorariosRoutes);
router.use('/estudiantes/horarios', authenticate, estudiantesHorariosRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);

// Ruta de prueba para verificar que la API está funcionando
router.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API de Academia FyL funcionando correctamente',
    version: '1.0.0'
  });
});

module.exports = router;