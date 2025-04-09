const { sequelize } = require('../../db/config');

// Obtener todos los horarios de profesores
const getTeacherSchedules = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM teachers_schedules');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los horarios de profesores' });
  }
};

// Obtener los horarios de un profesor específico por fecha
const getTeacherSchedulesByDate = async (req, res) => {  try {
    const { id } = req.params;
    const { fecha } = req.query;
    
    // Si no se proporciona fecha, usamos la fecha actual
    let startDate = fecha ? new Date(fecha) : new Date();
      // Calcular el inicio de la semana (lunes)
    const dayOfWeek = startDate.getDay(); // 0 para domingo, 1 para lunes, etc.
    const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startDate = new Date(startDate.setDate(diff));
    
    // Calcular el fin de la semana (domingo)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    // Formatear fechas para SQL
    const startDateFormatted = startDate.toISOString().split('T')[0];
    const endDateFormatted = endDate.toISOString().split('T')[0];
    
    // Consulta SQL simplificada sin condiciones complejas
    const query = `
      SELECT s.*, ts.idacademies
      FROM schedules s
      INNER JOIN teachers_schedules ts ON s.idschedule = ts.idschedule
      WHERE ts.idteacher = ?
    `;
    
    // Nota: Con type: sequelize.QueryTypes.SELECT, sequelize ya devuelve las filas directamente
    const rows = await sequelize.query(query, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });
    
    // Enviamos un array vacío si no hay resultados en lugar de undefined
    res.status(200).json(rows || []);
  } catch (error){
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los horarios del profesor' });
  }
};

// Crear una nueva relación profesor-horario
const createTeacherSchedule = async (req, res) => {
  try {
    const { idteacher, idschedule, idacademies } = req.body;
    const [result] = await sequelize.query(
      'INSERT INTO teachers_schedules (idteacher, idschedule, idacademies) VALUES (?, ?, ?)', 
      [idteacher, idschedule, idacademies]
    );
    res.status(201).json({ idteacher, idschedule, idacademies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la relación profesor-horario' });
  }
};

// Eliminar una relación profesor-horario
const deleteTeacherSchedule = async (req, res) => {
  try {
    const { idteacher, idschedule } = req.params;
    const [result] = await sequelize.query('DELETE FROM teachers_schedules WHERE idteacher = ? AND idschedule = ?', [idteacher, idschedule]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relación profesor-horario no encontrada' });
    }
    res.status(200).json({ message: 'Relación profesor-horario eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación profesor-horario' });
  }
};

module.exports = {
  getTeacherSchedules,
  getTeacherSchedulesByDate,
  createTeacherSchedule,
  deleteTeacherSchedule,
};