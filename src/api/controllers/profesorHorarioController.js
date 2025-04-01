const db = require('../../db/config');

// Obtener todos los horarios de profesores
const getTeacherSchedules = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teachers_schedules');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los horarios de profesores' });
  }
};

// Crear una nueva relación profesor-horario
const createTeacherSchedule = async (req, res) => {
  try {
    const { idteacher, idschedule } = req.body;
    const [result] = await db.query('INSERT INTO teachers_schedules (idteacher, idschedule) VALUES (?, ?)', [idteacher, idschedule]);
    res.status(201).json({ idteacher, idschedule });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación profesor-horario' });
  }
};

// Eliminar una relación profesor-horario
const deleteTeacherSchedule = async (req, res) => {
  try {
    const { idteacher, idschedule } = req.params;
    const [result] = await db.query('DELETE FROM teachers_schedules WHERE idteacher = ? AND idschedule = ?', [idteacher, idschedule]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relación profesor-horario no encontrada' });
    }
    res.status(200).json({ message: 'Relación profesor-horario eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación profesor-horario' });
  }
};

module.exports = {
  getTeacherSchedules,
  createTeacherSchedule,
  deleteTeacherSchedule,
};