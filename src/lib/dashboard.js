/**
 * Formatea los datos de estudiantes para su visualización en el dashboard
 * @param {Array} students - Lista de estudiantes desde la API
 * @returns {Array} - Lista de estudiantes formateada
 */
export const formatStudents = (students) => {
  if (!students || !Array.isArray(students)) return [];
  
  return students.map(student => ({
    id: student.idstudent,
    name: `${student.name || ''} ${student.surname || ''}`.trim(),
    dni: student.dni || 'No disponible',
    birthDate: student.birthDate || null,
    status: student.status === 'true' ? 'Activo' : 'Inactivo',
    email: student.email || 'No disponible',
    phone: student.phone || 'No disponible'
  }));
};

/**
 * Formatea los datos de profesores para su visualización en el dashboard
 * @param {Array} teachers - Lista de profesores desde la API
 * @returns {Array} - Lista de profesores formateada
 */
export const formatTeachers = (teachers) => {
  if (!teachers || !Array.isArray(teachers)) return [];
  
  return teachers.map(teacher => ({
    id: teacher.idteacher,
    name: teacher.name || 'Sin nombre',
    email: teacher.email || 'No disponible',
    phone: teacher.phone || 'No disponible',
    status: teacher.status || 'active'
  }));
};

/**
 * Formatea los datos de asignaturas para su visualización en el dashboard
 * @param {Array} subjects - Lista de asignaturas desde la API
 * @returns {Array} - Lista de asignaturas formateada
 */
export const formatSubjects = (subjects) => {
  if (!subjects || !Array.isArray(subjects)) return [];
  
  return subjects.map(subject => ({
    id: subject.idsubject,
    name: `${subject.year}º ${subject.cycle}`,
    course: subject.year || 'No especificado',
    cycle: subject.cycle || 'No especificado',
    year: subject.year,
    fullName: `${subject.year}º de ${subject.cycle}`
  }));
};

/**
 * Calcula estadísticas para el dashboard
 * @param {Object} data - Objetos con los datos del sistema
 * @returns {Object} - Objeto con estadísticas calculadas
 */
export const calculateStats = (data) => {
  const { students = [], teachers = [], subjects = [], academies = [] } = data;
  
  // Calcular distribución por ciclo educativo
  const cycleDistribution = students.reduce((acc, student) => {
    const cycle = student.cycle || 'No especificado';
    acc[cycle] = (acc[cycle] || 0) + 1;
    return acc;
  }, {});
  
  // Calcular distribución por asignatura
  const subjectDistribution = subjects.reduce((acc, subject) => {
    const name = subject.name || 'Sin nombre';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  
  return {
    counts: {
      students: students.length,
      teachers: teachers.length,
      subjects: subjects.length,
      academies: academies.length
    },
    cycleDistribution,
    subjectDistribution
  };
};
