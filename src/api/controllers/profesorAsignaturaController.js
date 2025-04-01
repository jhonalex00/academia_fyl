const db = require('../../db/config');

// Obtener todas las asignaturas de profesores
const getTeacherSubjects = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teachers_subjects');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asignaturas de profesores' });
  }
};

// Crear una nueva relación profesor-asignatura
const createTeacherSubject = async (req, res) => {
  try {
    const { idteacher, idsubject } = req.body;
    const [result] = await db.query('INSERT INTO teachers_subjects (idteacher, idsubject) VALUES (?, ?)', [idteacher, idsubject]);
    res.status(201).json({ idteacher, idsubject });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación profesor-asignatura' });
  }
};

// Eliminar una relación profesor-asignatura
const deleteTeacherSubject = async (req, res) => {
  try {
    const { idteacher, idsubject } = req.params;
    const [result] = await db.query('DELETE FROM teachers_subjects WHERE idteacher = ? AND idsubject = ?', [idteacher, idsubject]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relación profesor-asignatura no encontrada' });
    }
    res.status(200).json({ message: 'Relación profesor-asignatura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación profesor-asignatura' });
  }
};

module.exports = {
  getTeacherSubjects,
  createTeacherSubject,
  deleteTeacherSubject,
};