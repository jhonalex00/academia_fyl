const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const cors = require('cors');
const { testConnection } = require('./src/db/config');
const apiRoutes = require('./src/api/routes');
const academiasRoutes = require('./src/api/routes/academias');

// Determinar si estamos en desarrollo o producción
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Puerto para el servidor
const PORT = process.env.PORT || 3001

// Preparar la aplicación Next.js
app.prepare()
  .then(async () => {
    const server = express();
    
    // Probar la conexión a la base de datos
    await testConnection();
    
    // Middlewares
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    
    // Rutas de la API
    server.use('/api', apiRoutes);
    // No es necesario registrar academias específicamente, ya está incluido en apiRoutes
    
    // Next.js manejará todas las demás rutas
    server.all('*', (req, res) => {
      return handle(req, res);
    });
    
    // Iniciar servidor
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Servidor listo en http://localhost:${PORT}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });