const db = require('../../db/config');

// Obtener todos los profesores
const getTeachers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teachers');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los profesores' });
  }
};

// Obtener un profesor por ID
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM teachers WHERE idteacher = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el profesor' });
  }
};

// Crear un nuevo profesor
const createTeacher = async (req, res) => {
  try {
    const { name, phone, email, status } = req.body;
    const [result] = await db.query('INSERT INTO teachers (name, phone, email, status) VALUES (?, ?, ?, ?)', [name, phone, email, status]);
    res.status(201).json({ id: result.insertId, name, phone, email, status });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el profesor' });
  }
};

// Actualizar un profesor existente
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, status } = req.body;
    const [result] = await db.query('UPDATE teachers SET name = ?, phone = ?, email = ?, status = ? WHERE idteacher = ?', [name, phone, email, status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.status(200).json({ id, name, phone, email, status });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el profesor' });
  }
};

// Eliminar un profesor
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM teachers WHERE idteacher = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.status(200).json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el profesor' });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};