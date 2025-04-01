const { sequelize } = require('../../db/config');

// Obtener todos los horarios de estudiantes
const getStudentSchedules = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM students_schedules');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los horarios de estudiantes' });
  }
};

// Crear una nueva relación estudiante-horario
const createStudentSchedule = async (req, res) => {
  try {
    const { idstudent, idschedule, status } = req.body;
    const [result] = await sequelize.query('INSERT INTO students_schedules (idstudent, idschedule, status) VALUES (?, ?, ?)', [idstudent, idschedule, status]);
    res.status(201).json({ idstudent, idschedule, status });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación estudiante-horario' });
  }
};

// Eliminar una relación estudiante-horario
const deleteStudentSchedule = async (req, res) => {
  try {
    const { idstudent, idschedule } = req.params;
    const [result] = await sequelize.query('DELETE FROM students_schedules WHERE idstudent = ? AND idschedule = ?', [idstudent, idschedule]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relación estudiante-horario no encontrada' });
    }
    res.status(200).json({ message: 'Relación estudiante-horario eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación estudiante-horario' });
  }
};

module.exports = {
  getStudentSchedules,
  createStudentSchedule,
  deleteStudentSchedule,
};