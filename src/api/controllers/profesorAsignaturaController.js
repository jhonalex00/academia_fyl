const { sequelize } = require('../../db/config');

// Obtener todas las asignaturas de profesores
const getTeacherSubjects = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM teachers_subjects');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asignaturas de profesores' });
  }
};

// Obtener todas las asignaturas de un profesor específico
const getTeacherSubjectsByTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Consulta SQL para obtener asignaturas completas de un profesor
    const query = `
      SELECT s.*, ts.idteacher
      FROM subjects s
      INNER JOIN teachers_subjects ts ON s.idsubject = ts.idsubject
      WHERE ts.idteacher = ?
    `;
    
    const rows = await sequelize.query(query, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });
    
    res.status(200).json(rows || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las asignaturas del profesor' });
  }
};

// Crear una nueva relación profesor-asignatura
const createTeacherSubject = async (req, res) => {
  try {
    const { idteacher, idsubject } = req.body;
    const [result] = await sequelize.query('INSERT INTO teachers_subjects (idteacher, idsubject) VALUES (?, ?)', [idteacher, idsubject]);
    res.status(201).json({ idteacher, idsubject });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación profesor-asignatura' });
  }
};

// Eliminar una relación profesor-asignatura
const deleteTeacherSubject = async (req, res) => {
  try {
    const { idteacher, idsubject } = req.params;
    const [result] = await sequelize.query('DELETE FROM teachers_subjects WHERE idteacher = ? AND idsubject = ?', [idteacher, idsubject]);
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
  getTeacherSubjectsByTeacher,
  createTeacherSubject,
  deleteTeacherSubject,
};