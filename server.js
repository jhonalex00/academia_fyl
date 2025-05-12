const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { testConnection } = require('./src/db/config');
const apiRoutes = require('./src/api/routes');
const academiasRoutes = require('./src/api/routes/academias'); // opcional si no está dentro de apiRoutes

// Puerto para el servidor
const PORT = process.env.PORT || 3001;

(async () => {
  const server = express();

  // Probar la conexión a la base de datos
  await testConnection();

  // Middlewares
  server.use(cors());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Rutas de la API
  server.use('/api', apiRoutes);
  console.log("Rutas cargadas correctamente");
  // Si necesitas rutas separadas para academias:
  // server.use('/api/academias', academiasRoutes);

  // Iniciar servidor
  server.listen(PORT, () => {
    console.log(`✅ Backend Express corriendo en http://localhost:${PORT}`);
  });
})();
