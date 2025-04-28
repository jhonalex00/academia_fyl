const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getRecentActivities, 
  getCalendarEvents,
  getSubjectStats,
  getStudentStats
} = require('../controllers/dashboardController');

// Obtener estadísticas del dashboard
router.get('/stats', getDashboardStats);

// Obtener actividades recientes
router.get('/activities', getRecentActivities);

// Obtener eventos del calendario
router.get('/calendar', getCalendarEvents);

// Obtener estadísticas detalladas de asignaturas
router.get('/subjects/stats', getSubjectStats);

// Obtener estadísticas detalladas de estudiantes
router.get('/students/stats', getStudentStats);

module.exports = router;
