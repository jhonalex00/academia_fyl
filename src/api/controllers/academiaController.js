const { sequelize } = require('../../db/config');


// Obtener todas las academias
const getAcademies = async (req, res) => {
  try {
    console.log("HEADERS:", req.headers); // Aquí req está definido
    const [rows] = await sequelize.query('SELECT * FROM academies');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las academias' });
  }
};

// Obtener una academia por ID
const getAcademyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await sequelize.query(
      'SELECT * FROM academies WHERE idacademy = ?',
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Academia no encontrada' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la academia' });
  }
};

// Crear una nueva academia
const createAcademy = async (req, res) => {
  try {
    const { name, adress, phone } = req.body;
    const [result] = await sequelize.query('INSERT INTO academies (name, adress, phone) VALUES (?, ?, ?)', [name, adress, phone]);
    res.status(201).json({ id: result.insertId, name, adress, phone });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la academia' });
  }
};

// Actualizar una academia existente
const updateAcademy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, adress, phone } = req.body;
    const [result] = await sequelize.query('UPDATE academies SET name = ?, adress = ?, phone = ? WHERE idacademy = ?', [name, adress, phone, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Academia no encontrada' });
    }
    res.status(200).json({ id, name, adress, phone });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la academia' });
  }
};

// Eliminar una academia
const deleteAcademy = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await sequelize.query('DELETE FROM academies WHERE idacademy = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Academia no encontrada' });
    }
    res.status(200).json({ message: 'Academia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la academia' });
  }
};

module.exports = {
  getAcademies,
  getAcademyById,
  createAcademy,
  updateAcademy,
  deleteAcademy,
};