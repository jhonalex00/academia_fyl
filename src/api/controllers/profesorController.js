const { sequelize } = require('../../db/config');

// Obtener todos los profesores
const getTeachers = async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        t.*,
        GROUP_CONCAT(s.stage) as subjects
      FROM teachers t
      LEFT JOIN teachers_subjects ts ON t.idteacher = ts.idteacher
      LEFT JOIN subjects s ON ts.idsubject = s.idsubject
      GROUP BY t.idteacher
    `);
    
    // Procesar los resultados para convertir subjects en array
    const teachersWithSubjects = rows.map(teacher => ({
      ...teacher,
      subjects: teacher.subjects ? teacher.subjects.split(',') : []
    }));
    
    console.log('Profesores con asignaturas:', JSON.stringify(teachersWithSubjects, null, 2));
    res.status(200).json(teachersWithSubjects);
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ error: 'Error al obtener los profesores' });
  }
};

// Obtener un profesor por ID
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await sequelize.query('SELECT * FROM teachers WHERE idteacher = ?', [id]);
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
    console.log('Datos recibidos en el servidor:', JSON.stringify(req.body, null, 2));
    
    const { name, phone, email, password, subjects, status } = req.body;

    // Validar datos requeridos
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios (nombre, email, teléfono, contraseña)' 
      });
    }

    console.log('Intentando insertar profesor con datos:', { name, phone, email, password: '***', status: status || 'active' });

    // Primero crear el profesor
    const [result] = await sequelize.query(
      'INSERT INTO teachers (name, phone, email, password, status) VALUES (?, ?, ?, ?, ?)',
      {
        replacements: [name, phone, email, password, status || 'active']
      }
    );

    const teacherId = result.insertId;
    console.log('Profesor creado con ID:', teacherId);

    // Luego insertar las asignaturas si existen
    if (subjects && subjects.length > 0) {
      console.log('Procesando asignaturas:', subjects);
      
      for (const subjectName of subjects) {
        try {
          console.log('Buscando asignatura:', subjectName);
          
          // Primero buscar el ID de la asignatura por su nombre
          const [subjectRows] = await sequelize.query(
            'SELECT idsubject FROM subjects WHERE cycle = ?',
            {
              replacements: [subjectName]
            }
          );
          
          console.log('Resultado de búsqueda de asignatura:', subjectRows);
          
          if (subjectRows.length > 0) {
            const subjectId = subjectRows[0].idsubject;
            console.log('Insertando relación profesor-asignatura:', { teacherId, subjectId });
            
            // Insertar en la tabla teachers_subjects con los campos correctos
            await sequelize.query(
              'INSERT INTO teachers_subjects (idteacher, idsubject) VALUES (?, ?)',
              {
                replacements: [teacherId, subjectId]
              }
            );
            console.log('Relación insertada exitosamente');
          } else {
            console.log('No se encontró la asignatura:', subjectName);
          }
        } catch (subjectError) {
          console.error('Error al procesar asignatura:', subjectName, subjectError);
          // No lanzar el error, solo loggearlo para que no interrumpa la creación del profesor
        }
      }
    } else {
      console.log('No hay asignaturas para procesar');
    }

    console.log('Profesor creado exitosamente, preparando respuesta...');
    
    // Respuesta exitosa sin incluir password por seguridad
    const responseData = {
      id: teacherId,
      name,
      email,
      phone,
      subjects: subjects || [],
      status: status || 'active'
    };
    
    console.log('Enviando respuesta:', JSON.stringify(responseData, null, 2));
    res.status(201).json(responseData);

  } catch (error) {
    console.error('Error detallado al crear profesor:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,
      sqlMessage: error.sqlMessage,
      errno: error.errno,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Error al crear el profesor',
      details: error.message,
      sqlError: error.sqlMessage || 'No SQL error message'
    });
  }
};

// Actualizar un profesor existente
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, password, status, subjects } = req.body;
    
    console.log('Actualizando profesor ID:', id);
    console.log('Datos recibidos para actualización:', JSON.stringify({...req.body, password: password ? '***' : undefined}, null, 2));
    
    // Validar que el ID sea válido
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID de profesor inválido' });
    }
    
    // Validar datos requeridos
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios (nombre, email, teléfono)' 
      });
    }
    
    // Construir la consulta SQL dinámicamente según si se incluye password o no
    let updateQuery;
    let replacements;
    
    if (password && password.trim() !== '') {
      console.log('Actualizando con nueva contraseña');
      updateQuery = 'UPDATE teachers SET name = ?, phone = ?, email = ?, password = ?, status = ? WHERE idteacher = ?';
      replacements = [name, phone, email, password, status || 'active', id];
    } else {
      console.log('Actualizando sin cambiar contraseña');
      updateQuery = 'UPDATE teachers SET name = ?, phone = ?, email = ?, status = ? WHERE idteacher = ?';
      replacements = [name, phone, email, status || 'active', id];
    }
    
    console.log('Ejecutando actualización con datos:', { id, name, phone, email, password: password ? '***' : 'sin cambios', status });
    
    const [result] = await sequelize.query(updateQuery, {
      replacements: replacements
    });
    
    console.log('Resultado de la actualización:', result);
    
    // Verificar si el profesor existe basándose en la información de MySQL
    const infoMatch = result.info && result.info.match(/Rows matched: (\d+)/);
    const rowsMatched = infoMatch ? parseInt(infoMatch[1]) : result.affectedRows;
    
    if (rowsMatched === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    
    // Actualizar las asignaturas si se proporcionaron
    if (subjects && Array.isArray(subjects)) {
      console.log('Actualizando asignaturas del profesor:', subjects);
      
      // Primero eliminar todas las asignaturas existentes del profesor
      await sequelize.query(
        'DELETE FROM teachers_subjects WHERE idteacher = ?',
        {
          replacements: [id]
        }
      );
      
      // Luego insertar las nuevas asignaturas
      for (const subjectName of subjects) {
        console.log('Procesando asignatura:', subjectName);
        
        // Buscar el ID de la asignatura por su nombre
        const [subjectRows] = await sequelize.query(
          'SELECT idsubject FROM subjects WHERE cycle = ?',
          {
            replacements: [subjectName]
          }
        );
        
        console.log('Resultado de búsqueda de asignatura:', subjectRows);
        
        if (subjectRows.length > 0) {
          const subjectId = subjectRows[0].idsubject;
          console.log('Insertando relación profesor-asignatura:', { teacherId: id, subjectId });
          
          // Insertar en la tabla teachers_subjects
          await sequelize.query(
            'INSERT INTO teachers_subjects (idteacher, idsubject) VALUES (?, ?)',
            {
              replacements: [id, subjectId]
            }
          );
        } else {
          console.log('No se encontró la asignatura:', subjectName);
        }
      }
    }
    
    console.log('Profesor actualizado exitosamente (filas coincidentes:', rowsMatched, ', filas cambiadas:', result.changedRows || result.affectedRows, ')');
      res.status(200).json({
      success: true,
      message: "Profesor actualizado correctamente",
      data: { id, name, phone, email, status: status || 'active', subjects }
      });
 
    } catch (error) {
    console.error('Error detallado al actualizar profesor:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,
      sqlMessage: error.sqlMessage,
      errno: error.errno,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Error al actualizar el profesor',
      details: error.message,
      sqlError: error.sqlMessage || 'No SQL error message'
    });
  }
};

// Eliminar un profesor
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Eliminando profesor ID:', id);
    
    // Validar que el ID sea válido
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID de profesor inválido' });
    }
    
    // Primero eliminar los mensajes del profesor
    console.log('Eliminando mensajes del profesor...');
    await sequelize.query(
      'DELETE FROM messages WHERE idteacher = ?',
      {
        replacements: [id]
      }
    );
    console.log('Mensajes del profesor eliminados');
    
    // Luego eliminar las relaciones en teachers_subjects
    console.log('Eliminando relaciones de asignaturas del profesor...');
    await sequelize.query(
      'DELETE FROM teachers_subjects WHERE idteacher = ?',
      {
        replacements: [id]
      }
    );
    console.log('Relaciones de asignaturas eliminadas');
    
    // También eliminar relaciones en teachers_schedules si existen
    console.log('Eliminando horarios del profesor...');
    await sequelize.query(
      'DELETE FROM teachers_schedules WHERE idteacher = ?',
      {
        replacements: [id]
      }
    );
    console.log('Horarios del profesor eliminados');
    
    // Finalmente eliminar el profesor
    console.log('Eliminando profesor de la tabla teachers...');
    const [result] = await sequelize.query(
      'DELETE FROM teachers WHERE idteacher = ?',
      {
        replacements: [id]
      }
    );
    
    console.log('Resultado de la eliminación:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    
    console.log('Profesor eliminado exitosamente');
    res.status(200).json({ 
      message: 'Profesor eliminado correctamente (incluyendo mensajes, asignaturas y horarios)',
      id: id
    });
    
  } catch (error) {
    console.error('Error detallado al eliminar profesor:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql,
      sqlMessage: error.sqlMessage,
      errno: error.errno,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Error al eliminar el profesor',
      details: error.message,
      sqlError: error.sqlMessage || 'No SQL error message'
    });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};