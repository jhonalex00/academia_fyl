const express = require('express');
const router = express.Router();

// Importar todas las rutas
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

// Configurar las rutas
router.use('/estudiantes', estudiantesRoutes);
router.use('/profesores', profesoresRoutes);
router.use('/asignaturas', asignaturasRoutes);
router.use('/horarios', horariosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/academias', academiasRoutes);
router.use('/contactos', contactosRoutes);
router.use('/profesores/horarios', profesoresHorariosRoutes);
router.use('/estudiantes/horarios', estudiantesHorariosRoutes);
router.use('/dashboard', dashboardRoutes);

// Ruta de prueba para verificar que la API está funcionando
router.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API de Academia FyL funcionando correctamente',
    version: '1.0.0'
  });
});

module.exports = router;