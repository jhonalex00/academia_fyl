const { sequelize } = require('../../db/config');

// Obtener todos los contactos de estudiantes
const getStudentContacts = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM students_contacts');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los contactos de estudiantes' });
  }
};

// Crear una nueva relación estudiante-contacto
const createStudentContact = async (req, res) => {
  try {
    const { idstudent, idcontact } = req.body;
    const [result] = await sequelize.query('INSERT INTO students_contacts (idstudent, idcontact) VALUES (?, ?)', [idstudent, idcontact]);
    res.status(201).json({ idstudent, idcontact });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación estudiante-contacto' });
  }
};

// Eliminar una relación estudiante-contacto
const deleteStudentContact = async (req, res) => {
  try {
    const { idstudent, idcontact } = req.params;
    const [result] = await sequelize.query('DELETE FROM students_contacts WHERE idstudent = ? AND idcontact = ?', [idstudent, idcontact]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relación estudiante-contacto no encontrada' });
    }
    res.status(200).json({ message: 'Relación estudiante-contacto eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación estudiante-contacto' });
  }
};

module.exports = {
  getStudentContacts,
  createStudentContact,
  deleteStudentContact,
};