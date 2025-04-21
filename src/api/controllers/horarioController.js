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
const createSchedule = async (req, res) => {  try {
    const { date, weekDay, startHour, finishHour } = req.body;
    
    console.log('Datos recibidos:', { date, weekDay, startHour, finishHour });
    
    // Validamos que los campos requeridos existan
    if (!weekDay || !startHour || !finishHour) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (weekDay, startHour, finishHour)' });
    }

    // Formatear las horas y validar formato
    let formattedStartHour;
    let formattedFinishHour;
    
    try {
      // Asegurar que las horas tengan el formato correcto HH:MM:SS
      if (startHour.length <= 5) {
        formattedStartHour = startHour + ':00';
      } else {
        formattedStartHour = startHour;
      }
      
      if (finishHour.length <= 5) {
        formattedFinishHour = finishHour + ':00';
      } else {
        formattedFinishHour = finishHour;
      }
      
      console.log('Horas formateadas:', { formattedStartHour, formattedFinishHour });
    } catch (formatError) {
      console.error('Error al formatear horas:', formatError);
      return res.status(400).json({ error: 'Formato de hora inválido' });
    }
    
    // Formatear fecha si existe (asegurar formato YYYY-MM-DD)
    let formattedDate = null;
    if (date) {
      try {
        formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
          console.error('Formato de fecha inválido:', date);
          return res.status(400).json({ error: 'Formato de fecha inválido' });
        }
        formattedDate = formattedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        console.log('Fecha formateada:', formattedDate);
      } catch (dateError) {
        console.error('Error al formatear fecha:', dateError);
        return res.status(400).json({ error: 'Formato de fecha inválido' });
      }
    }    // Ejecutar la consulta con valores seguros
    console.log('Ejecutando consulta SQL con valores:', { 
      date: formattedDate, 
      weekDay, 
      startHour: formattedStartHour, 
      finishHour: formattedFinishHour 
    });
      const [result] = await sequelize.query(
      'INSERT INTO schedules (date, weekDay, startHour, finishHour) VALUES (?, ?, ?, ?)', 
      { 
        replacements: [formattedDate, weekDay, formattedStartHour, formattedFinishHour],
        type: sequelize.QueryTypes.INSERT 
      }
    );
    
    console.log('Resultado de la inserción:', result);

    // El resultado de la inserción en MySQL puede ser directamente el ID o estar en una estructura
    // Vamos a manejar ambos casos
    let insertId;
    
    if (typeof result === 'number') {
      // Si el resultado es un número, ese es el ID
      insertId = result;
    } else if (result && typeof result === 'object') {
      // Si es un objeto, buscar el ID en varias propiedades posibles
      insertId = result.insertId || result.id || result;
    } else {
      // Si no podemos determinar el ID, lanzar un error
      throw new Error('No se pudo obtener el ID del horario creado');
    }
    
    console.log('ID del horario creado:', insertId);

    res.status(201).json({ 
      id: insertId, 
      date: formattedDate, 
      weekDay, 
      startHour: formattedStartHour, 
      finishHour: formattedFinishHour 
    });
  } catch (error) {
    console.error('Error detallado al crear horario:', error);
    res.status(500).json({ error: 'Error al crear el horario: ' + error.message });
  }
};

// Actualizar un horario existente
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, weekDay, startHour, finishHour } = req.body;
    
    console.log('Actualizando horario:', { id, date, weekDay, startHour, finishHour });
    
    // Validamos que los campos requeridos existan
    if (!weekDay || !startHour || !finishHour) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (weekDay, startHour, finishHour)' });
    }
    
    // Formatear las horas
    let formattedStartHour = startHour;
    let formattedFinishHour = finishHour;
    
    try {
      // Asegurar que las horas tengan el formato correcto HH:MM:SS
      if (startHour.length <= 5) {
        formattedStartHour = startHour + ':00';
      }
      
      if (finishHour.length <= 5) {
        formattedFinishHour = finishHour + ':00';
      }
      
      console.log('Horas formateadas para actualización:', { formattedStartHour, formattedFinishHour });
    } catch (formatError) {
      console.error('Error al formatear horas:', formatError);
      return res.status(400).json({ error: 'Formato de hora inválido' });
    }
    
    // Formatear fecha si existe
    let formattedDate = null;
    if (date) {
      try {
        formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
          console.error('Formato de fecha inválido:', date);
          return res.status(400).json({ error: 'Formato de fecha inválido' });
        }
        formattedDate = formattedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        console.log('Fecha formateada para actualización:', formattedDate);
      } catch (dateError) {
        console.error('Error al formatear fecha:', dateError);
        return res.status(400).json({ error: 'Formato de fecha inválido' });
      }
    }
      console.log('Ejecutando actualización con valores:', {
      id,
      date: formattedDate,
      weekDay,
      startHour: formattedStartHour,
      finishHour: formattedFinishHour
    });
    
    try {
      // Primero verificamos que el horario exista
      const [checkResult] = await sequelize.query(
        'SELECT idschedule FROM schedules WHERE idschedule = ?', 
        { 
          replacements: [id],
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      console.log('Resultado de verificación:', checkResult);
      
      if (!checkResult) {
        return res.status(404).json({ error: 'Horario no encontrado' });
      }
      
      // Realizamos la actualización
      await sequelize.query(
        'UPDATE schedules SET date = ?, weekDay = ?, startHour = ?, finishHour = ? WHERE idschedule = ?', 
        { 
          replacements: [formattedDate, weekDay, formattedStartHour, formattedFinishHour, id],
          type: sequelize.QueryTypes.UPDATE
        }
      );
      
      console.log('Actualización realizada con éxito para el id:', id);
    } catch (updateError) {
      console.error('Error en la actualización SQL:', updateError);
      throw new Error('Error en la operación SQL: ' + updateError.message);
    }
    
    res.status(200).json({ 
      id, 
      date: formattedDate, 
      weekDay, 
      startHour: formattedStartHour, 
      finishHour: formattedFinishHour 
    });
  } catch (error) {
    console.error('Error detallado al actualizar horario:', error);
    res.status(500).json({ error: 'Error al actualizar el horario: ' + error.message });
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