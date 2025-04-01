const db = require('../../db/config');

// Obtener todas las inscripciones
const getEnrolments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM enrolment');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las inscripciones' });
  }
};

// Obtener una inscripción por ID
const getEnrolmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM enrolment WHERE idenrolment = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la inscripción' });
  }
};

// Crear una nueva inscripción
const createEnrolment = async (req, res) => {
  try {
    const { enrolmentDate, year, school, mode, type, siblings, sibblingName, alone, confiscateMobile, classesApproach, pictures, socialMedia } = req.body;
    const [result] = await db.query(
      'INSERT INTO enrolment (enrolmentDate, year, school, mode, type, siblings, sibblingName, alone, confiscateMobile, classesApproach, pictures, socialMedia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [enrolmentDate, year, school, mode, type, siblings, sibblingName, alone, confiscateMobile, classesApproach, pictures, socialMedia]
    );
    res.status(201).json({ id: result.insertId, enrolmentDate, year, school, mode, type, siblings, sibblingName, alone, confiscateMobile, classesApproach, pictures, socialMedia });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la inscripción' });
  }
};

// Actualizar una inscripción existente
const updateEnrolment = async (req, res) => {
  try {
    const { id } = req.params;
    const { enrolmentDate, year, school, mode, type, siblings, sibblingName, alone, confiscateMobile, classesApproach, pictures, socialMedia } = req.body;
    const [result] = await db.query(
      'UPDATE enrolment SET enrolmentDate = ?, year = ?, school = ?, mode = ?, type = ?, siblings = ?, sibblingName = ?, alone = ?, confiscateMobile = ?, classesApproach = ?, pictures = ?, socialMedia = ? WHERE idenrolment = ?',
      [enrolmentDate, year, school, mode, type, siblings, sibblingName, alone, confiscateMobile, classesApproach, pictures, socialMedia, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }
    res.status(200).json({ id, enrolmentDate, year, school, mode, type, siblings, sibblingName, alone, confiscateMobile, classesApproach, pictures, socialMedia });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la inscripción' });
  }
};

// Eliminar una inscripción
const deleteEnrolment = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM enrolment WHERE idenrolment = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }
    res.status(200).json({ message: 'Inscripción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la inscripción' });
  }
};

module.exports = {
  getEnrolments,
  getEnrolmentById,
  createEnrolment,
  updateEnrolment,
  deleteEnrolment,
};