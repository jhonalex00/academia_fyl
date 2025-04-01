const db = require('../../db/config');

// Obtener todos los contactos
const getContacts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacts');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los contactos' });
  }
};

// Obtener un contacto por ID
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM contacts WHERE idcontact = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el contacto' });
  }
};

// Crear un nuevo contacto
const createContact = async (req, res) => {
  try {
    const { phone, name } = req.body;
    const [result] = await db.query('INSERT INTO contacts (phone, name) VALUES (?, ?)', [phone, name]);
    res.status(201).json({ id: result.insertId, phone, name });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el contacto' });
  }
};

// Actualizar un contacto existente
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, name } = req.body;
    const [result] = await db.query('UPDATE contacts SET phone = ?, name = ? WHERE idcontact = ?', [phone, name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.status(200).json({ id, phone, name });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el contacto' });
  }
};

// Eliminar un contacto
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM contacts WHERE idcontact = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.status(200).json({ message: 'Contacto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el contacto' });
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};