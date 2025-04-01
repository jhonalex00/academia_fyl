const { sequelize } = require('../../db/config');

// Obtener todos los horarios
const getSchedules = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM schedules');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los horarios' });
  }
};

// Obtener un horario por ID
const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await sequelize.query('SELECT * FROM schedules WHERE idschedule = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el horario' });
  }
};

// Crear un nuevo horario
const createSchedule = async (req, res) => {
  try {
    const { date, weekDay, startHour, finishHour } = req.body;
    const [result] = await sequelize.query('INSERT INTO schedules (date, weekDay, startHour, finishHour) VALUES (?, ?, ?, ?)', [date, weekDay, startHour, finishHour]);
    res.status(201).json({ id: result.insertId, date, weekDay, startHour, finishHour });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el horario' });
  }
};

// Actualizar un horario existente
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, weekDay, startHour, finishHour } = req.body;
    const [result] = await sequelize.query('UPDATE schedules SET date = ?, weekDay = ?, startHour = ?, finishHour = ? WHERE idschedule = ?', [date, weekDay, startHour, finishHour, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.status(200).json({ id, date, weekDay, startHour, finishHour });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el horario' });
  }
};

// Eliminar un horario
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await sequelize.query('DELETE FROM schedules WHERE idschedule = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.status(200).json({ message: 'Horario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el horario' });
  }
};

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};