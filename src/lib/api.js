// Función para obtener todos los estudiantes
export const getStudents = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/estudiantes');
    if (!response.ok) {
      throw new Error('Error al obtener los estudiantes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener todas las academias
export const getAcademies = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/academias');
    if (!response.ok) {
      throw new Error('Error al obtener las academias');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener todos los profesores
export const getTeachers = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/profesores');
    if (!response.ok) {
      throw new Error('Error al obtener los profesores');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener todas las asignaturas
export const getSubjects = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/asignaturas');
    if (!response.ok) {
      throw new Error('Error al obtener las asignaturas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener todas las inscripciones
export const getEnrolments = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/inscripciones');
    if (!response.ok) {
      throw new Error('Error al obtener las inscripciones');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener los horarios
export const getSchedules = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/horarios');
    if (!response.ok) {
      throw new Error('Error al obtener los horarios');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener estadísticas del dashboard
export const getDashboardStats = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/dashboard/stats');
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas del dashboard');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener actividades recientes
export const getRecentActivities = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/dashboard/activities');
    if (!response.ok) {
      throw new Error('Error al obtener actividades recientes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener eventos del calendario
export const getCalendarEvents = async (month, year) => {
  try {
    const response = await fetch(`http://localhost:3001/api/dashboard/calendar?month=${month}&year=${year}`);
    if (!response.ok) {
      throw new Error('Error al obtener eventos del calendario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
