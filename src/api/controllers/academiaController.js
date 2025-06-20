const { sequelize } = require("../../db/config");

// Obtener todas las academias
const getAcademies = async (req, res) => {
  try {
    const [rows] = await sequelize.query("SELECT * FROM academies");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las academias" });
  }
};

// Obtener una academia por ID
const getAcademyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await sequelize.query(
      "SELECT * FROM academies WHERE idacademy = ?",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Academia no encontrada" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la academia" });
  }
};

// Crear una nueva academia
const createAcademy = async (req, res) => {
  try {
    const { name, address, phone } = req.body;

    const [result] = await sequelize.query(
      "INSERT INTO academies (name, address, phone) VALUES (?, ?, ?)",
      {
        replacements: [name, address, phone],
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({
      id: result, // En MySQL, `result` puede ser el insertId directamente
      name,
      address,
      phone,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la academia" });
  }
};

// Actualizar una academia existente
const updateAcademy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone } = req.body;

    const [result] = await sequelize.query(
      "UPDATE academies SET name = ?, address = ?, phone = ? WHERE idacademy = ?",
      {
        replacements: [name, address, phone, id],
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    // Algunas versiones devuelven `result.affectedRows`, otras un número directo
    const affected = result?.affectedRows || result;

    if (affected === 0) {
      return res.status(404).json({ error: "Academia no encontrada" });
    }

    res.status(200).json({ id, name, address, phone });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la academia" });
  }
};

// Eliminar una academia
const deleteAcademy = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await sequelize.query(
      "DELETE FROM academies WHERE idacademy = ?",
      {
        replacements: [id],
        type: sequelize.QueryTypes.DELETE,
      }
    );

    const affected = result?.affectedRows || result;

    if (affected === 0) {
      return res.status(404).json({ error: "Academia no encontrada" });
    }

    res.status(200).json({ message: "Academia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la academia" });
  }
};

module.exports = {
  getAcademies,
  getAcademyById,
  createAcademy,
  updateAcademy,
  deleteAcademy,
};
