const { sequelize } = require('../../db/config');

// Obtener estadísticas del dashboard
const getDashboardStats = async (req, res) => {
  try {
    // Obtener conteo de estudiantes
    const [studentCount] = await sequelize.query('SELECT COUNT(*) as count FROM students');
    
    // Obtener conteo de profesores
    const [teacherCount] = await sequelize.query('SELECT COUNT(*) as count FROM teachers');
    
    // Obtener conteo de asignaturas
    const [subjectCount] = await sequelize.query('SELECT COUNT(*) as count FROM subjects');
    
    // Obtener conteo de academias
    const [academyCount] = await sequelize.query('SELECT COUNT(*) as count FROM academies');
    
    // Obtener distribución por ciclo educativo
    const [cycleDistribution] = await sequelize.query(`
      SELECT cycle, COUNT(*) as count 
      FROM subjects 
      GROUP BY cycle
    `);
    
    // Estadísticas simuladas (podrían ser consultas reales a la base de datos)
    const studentGrowth = 12; // % de crecimiento de estudiantes
    const teacherGrowth = 5;  // % de crecimiento de profesores
    const subjectGrowth = 8;  // % de crecimiento de asignaturas
    const academyGrowth = 3;  // % de crecimiento de academias
    
    res.status(200).json({
      counts: {
        students: studentCount[0]?.count || 0,
        teachers: teacherCount[0]?.count || 0,
        subjects: subjectCount[0]?.count || 0,
        academies: academyCount[0]?.count || 0
      },
      growth: {
        students: studentGrowth,
        teachers: teacherGrowth,
        subjects: subjectGrowth,
        academies: academyGrowth
      },
      cycleDistribution: cycleDistribution || []
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
};

// Obtener actividades recientes
const getRecentActivities = async (req, res) => {
  try {
    // Simulación de actividades recientes para demostración
    // En un entorno real, esto vendría de una tabla de eventos o logs
    const activities = [
      {
        initials: 'MS',
        title: 'María Sánchez se ha registrado',
        description: 'Nueva alumna en Matemáticas de 2º de ESO',
        time: 'Hace 2 horas'
      },
      {
        initials: 'JR',
        title: 'Juan Rodríguez ha actualizado su perfil',
        description: 'Profesor de Física y Química',
        time: 'Hace 5 horas'
      },
      {
        initials: 'LP',
        title: 'Luis Pérez ha cancelado una clase',
        description: 'Historia - 17:00 - 18:30',
        time: 'Ayer'
      },
      {
        initials: 'AL',
        title: 'Academia Las Lomas añadida',
        description: 'Nueva sede registrada en el sistema',
        time: 'Hace 2 días'
      }
    ];
    
    res.status(200).json(activities);
    
  } catch (error) {
    console.error('Error al obtener actividades recientes:', error);
    res.status(500).json({ error: 'Error al obtener actividades recientes' });
  }
};

// Obtener eventos del calendario
const getCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Convertir los parámetros a números
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Validar los parámetros
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const targetMonth = isNaN(monthNum) ? currentMonth : monthNum;
    const targetYear = isNaN(yearNum) ? currentYear : yearNum;
    
    // En un entorno real, aquí consultaríamos a la base de datos
    // para obtener los eventos del mes y año especificados
    
    // Simulación de eventos para demostración
    const events = [
      {
        id: 1,
        title: 'Clase de Matemáticas',
        date: new Date(targetYear, targetMonth, 5, 16, 0, 0),
        teacher: 'Carlos Martínez',
        subject: 'Matemáticas',
        location: 'Aula 101'
      },
      {
        id: 2,
        title: 'Examen de Inglés',
        date: new Date(targetYear, targetMonth, 12, 10, 0, 0),
        teacher: 'Ana López',
        subject: 'Inglés',
        location: 'Aula 203'
      },
      {
        id: 3,
        title: 'Tutoría',
        date: new Date(targetYear, targetMonth, 18, 9, 30, 0),
        teacher: 'Roberto García',
        subject: 'Física',
        location: 'Sala de Profesores'
      },
      {
        id: 4,
        title: 'Reunión de profesores',
        date: new Date(targetYear, targetMonth, 25, 14, 0, 0),
        teacher: 'Dirección',
        subject: 'Coordinación',
        location: 'Sala de Juntas'
      }
    ];
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error al obtener eventos del calendario:', error);
    res.status(500).json({ error: 'Error al obtener eventos del calendario' });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivities,
  getCalendarEvents
};
