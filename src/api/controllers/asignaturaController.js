const db = require('../../db/config');

// Obtener todas las asignaturas
const getSubjects = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subjects');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las asignaturas' });
  }
};

// Obtener una asignatura por ID
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM subjects WHERE idsubject = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la asignatura' });
  }
};

// Crear una nueva asignatura
const createSubject = async (req, res) => {
  try {
    const { year, cycle } = req.body;
    const [result] = await db.query('INSERT INTO subjects (year, cycle) VALUES (?, ?)', [year, cycle]);
    res.status(201).json({ id: result.insertId, year, cycle });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la asignatura' });
  }
};

// Actualizar una asignatura existente
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, cycle } = req.body;
    const [result] = await db.query('UPDATE subjects SET year = ?, cycle = ? WHERE idsubject = ?', [year, cycle, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    res.status(200).json({ id, year, cycle });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la asignatura' });
  }
};

// Eliminar una asignatura
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM subjects WHERE idsubject = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    res.status(200).json({ message: 'Asignatura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la asignatura' });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};