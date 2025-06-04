/**
 * Librería de funciones para obtener datos de la API del dashboard
 */

const API_BASE_URL = '/api';

/**
 * Función auxiliar para hacer peticiones a la API
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en petición API ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Obtener todos los estudiantes
 */
export const getStudents = async () => {
  return await apiRequest('/estudiantes');
};

/**
 * Obtener todos los profesores
 */
export const getTeachers = async () => {
  return await apiRequest('/profesores');
};

/**
 * Obtener todas las asignaturas
 */
export const getSubjects = async () => {
  return await apiRequest('/asignaturas');
};

/**
 * Obtener todas las academias
 */
export const getAcademies = async () => {
  return await apiRequest('/academias');
};

/**
 * Obtener todos los horarios
 */
export const getSchedules = async () => {
  return await apiRequest('/horarios');
};

/**
 * Obtener estadísticas del dashboard
 */
export const getDashboardStats = async () => {
  return await apiRequest('/dashboard/stats');
};

/**
 * Obtener actividades recientes
 */
export const getRecentActivities = async () => {
  return await apiRequest('/dashboard/activities');
};

/**
 * Obtener eventos del calendario
 */
export const getCalendarEvents = async (month, year) => {
  const params = new URLSearchParams();
  if (month !== undefined) params.append('month', month);
  if (year !== undefined) params.append('year', year);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return await apiRequest(`/dashboard/calendar${query}`);
};

/**
 * Obtener estadísticas de asignaturas
 */
export const getSubjectStats = async () => {
  return await apiRequest('/dashboard/subjects/stats');
};

/**
 * Obtener estadísticas de estudiantes
 */
export const getStudentStats = async () => {
  return await apiRequest('/dashboard/students/stats');
};

/**
 * Obtener mensajes recientes
 */
export const getRecentMessages = async (limit = 10) => {
  return await apiRequest(`/mensajes?limit=${limit}`);
};

/**
 * Obtener horarios de un profesor específico
 */
export const getTeacherSchedules = async (teacherId) => {
  return await apiRequest(`/profesores/${teacherId}/horarios`);
};

/**
 * Obtener asignaturas de un profesor específico
 */
export const getTeacherSubjects = async (teacherId) => {
  return await apiRequest(`/profesores/${teacherId}/asignaturas`);
};

/**
 * Obtener estudiante por ID
 */
export const getStudentById = async (studentId) => {
  return await apiRequest(`/estudiantes/${studentId}`);
};

/**
 * Obtener profesor por ID
 */
export const getTeacherById = async (teacherId) => {
  return await apiRequest(`/profesores/${teacherId}`);
};

/**
 * Obtener inscripciones
 */
export const getEnrollments = async () => {
  return await apiRequest('/inscripciones');
};

/**
 * Obtener contactos
 */
export const getContacts = async () => {
  return await apiRequest('/contactos');
};
