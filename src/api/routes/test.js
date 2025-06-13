const express = require('express');
const { db } = require('../../db/connection');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS fecha_actual');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});

module.exports = router;
