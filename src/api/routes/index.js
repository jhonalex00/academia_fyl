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
const mensajesRoutes = require('./mensajes'); // ✅ RUTA AGREGADA

// Rutas públicas (sin autenticación)
router.use('/auth', authRoutes);
router.use('/mensajes', mensajesRoutes); // ✅ Ruta de mensajes abierta
router.use('/profesores', profesoresRoutes); // ✅ SIN AUTENTICACIÓN TEMPORAL
router.use('/contactos', contactosRoutes);   // ✅ SIN AUTENTICACIÓN TEMPORAL

// Rutas temporalmente abiertas para desarrollo del dashboard
router.use('/estudiantes', estudiantesRoutes);
router.use('/asignaturas', asignaturasRoutes);
router.use('/horarios', horariosRoutes);
router.use('/academias', academiasRoutes);
router.use('/dashboard', dashboardRoutes);

// Rutas protegidas (requieren autenticación)
// router.use('/estudiantes', authenticate, estudiantesRoutes);
// router.use('/asignaturas', authenticate, asignaturasRoutes);
// router.use('/horarios', authenticate, horariosRoutes);

const adminOnly = authorize(['admin']);
// Rutas de admin temporalmente comentadas para desarrollo
// router.use('/usuarios', authenticate, adminOnly, usuariosRoutes);
router.use('/usuarios', usuariosRoutes);
// router.use('/academias', authenticate, academiasRoutes);
// router.use('/profesores/horarios', authenticate, profesoresHorariosRoutes);
// router.use('/estudiantes/horarios', authenticate, estudiantesHorariosRoutes);
// router.use('/dashboard', authenticate, dashboardRoutes);
router.use('/profesores/horarios', profesoresHorariosRoutes);
router.use('/estudiantes/horarios', estudiantesHorariosRoutes);

// Ruta de prueba
router.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API de Academia FyL funcionando correctamente',
    version: '1.0.0'
  });
});

module.exports = router;
