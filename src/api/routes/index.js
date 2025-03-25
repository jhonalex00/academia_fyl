const express = require('express');
const router = express.Router();

// Importar todas las rutas
const estudiantesRoutes = require('./estudiantes');
const profesoresRoutes = require('./profesores');
const asignaturasRoutes = require('./asignaturas');
const horariosRoutes = require('./horarios');
const usuariosRoutes = require('./usuarios');

// Configurar las rutas
router.use('/estudiantes', estudiantesRoutes);
router.use('/profesores', profesoresRoutes);
router.use('/asignaturas', asignaturasRoutes);
router.use('/horarios', horariosRoutes);
router.use('/usuarios', usuariosRoutes);

// Ruta de prueba para verificar que la API está funcionando
router.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API de Academia FyL funcionando correctamente',
    version: '1.0.0'
  });
});

module.exports = router;