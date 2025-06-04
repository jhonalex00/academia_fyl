const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { testConnection } = require('./src/db/config');
const apiRoutes = require('./src/api/routes');

// Puerto para el servidor
const PORT = process.env.PORT || 3001;

(async () => {
  const server = express();

  // Probar la conexión a la base de datos
  console.log('🔍 Probando conexión a la base de datos...');
  await testConnection();

  // Middlewares
  server.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  
  server.use(bodyParser.json({ limit: '10mb' }));
  server.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  // Middleware de logging para desarrollo
  server.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Rutas de la API
  server.use('/api', apiRoutes);
  console.log("✅ Rutas de API cargadas correctamente");

  // Ruta de salud del servidor
  server.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK',
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  });

  // Manejo de errores
  server.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
  });

  // Manejo de rutas no encontradas
  server.use('*', (req, res) => {
    res.status(404).json({ 
      error: 'Ruta no encontrada',
      path: req.originalUrl 
    });
  });

  // Iniciar servidor
  server.listen(PORT, () => {
    console.log(`✅ Backend Express corriendo en http://localhost:${PORT}`);
    console.log(`📊 Dashboard API disponible en http://localhost:${PORT}/api/dashboard/stats`);
    console.log(`🏥 Health check en http://localhost:${PORT}/health`);
  });
})().catch(error => {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
});
