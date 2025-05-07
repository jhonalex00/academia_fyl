'use client';

import { apiGet, apiPost, apiPut, apiDelete } from './fetchClient';

// Función para obtener todos los alumnos
export const getStudents = async () => {
  try {
    return await apiGet('/alumnos');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener un alumno por ID
export const getStudentById = async (id) => {
  try {
    return await apiGet(`/alumnos/${id}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para crear un nuevo alumno
export const createStudent = async (student) => {
  try {
    return await apiPost('/alumnos', student);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para actualizar un alumno
export const updateStudent = async (id, student) => {
  try {
    return await apiPut(`/alumnos/${id}`, student);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para eliminar un alumno
export const deleteStudent = async (id) => {
  try {
    return await apiDelete(`/alumnos/${id}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener todos los profesores
export const getTeachers = async () => {
  try {
    return await apiGet('/profesores');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener un profesor por ID
export const getTeacherById = async (id) => {
  try {
    return await apiGet(`/profesores/${id}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para crear un nuevo profesor
export const createTeacher = async (teacher) => {
  try {
    return await apiPost('/profesores', teacher);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para actualizar un profesor
export const updateTeacher = async (id, teacher) => {
  try {
    return await apiPut(`/profesores/${id}`, teacher);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para eliminar un profesor
export const deleteTeacher = async (id) => {
  try {
    return await apiDelete(`/profesores/${id}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener todas las asignaturas
export const getSubjects = async () => {
  try {
    return await apiGet('/asignaturas');
  } catch (error){
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener todas las inscripciones
export const getEnrolments = async () => {
  try {
    return await apiGet('/inscripciones');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener los horarios
export const getSchedules = async () => {
  try {
    return await apiGet('/horarios');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener estadísticas del dashboard
export const getDashboardStats = async () => {
  try {
    return await apiGet('/dashboard/stats');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener estadísticas de asignaturas
export const getSubjectStats = async () => {
  try {
    return await apiGet('/dashboard/subjects/stats');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener estadísticas de estudiantes
export const getStudentStats = async () => {
  try {
    return await apiGet('/dashboard/students/stats');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener actividades recientes
export const getRecentActivities = async () => {
  try {
    return await apiGet('/dashboard/activities');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener eventos del calendario
export const getCalendarEvents = async (month, year) => {
  try {
    return await apiGet(`/dashboard/calendar?month=${month}&year=${year}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para obtener asignaturas de un profesor
export const getTeacherSubjects = async (idteacher) => {
  try {
    return await apiGet(`/profesores/${idteacher}/asignaturas`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
