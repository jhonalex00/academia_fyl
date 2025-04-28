const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentActivities, getCalendarEvents } = require('../controllers/dashboardController');

// Obtener estadísticas del dashboard
router.get('/stats', getDashboardStats);

// Obtener actividades recientes
router.get('/activities', getRecentActivities);

// Obtener eventos del calendario
router.get('/calendar', getCalendarEvents);

module.exports = router;
