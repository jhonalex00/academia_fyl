const { sequelize } = require('../../db/config');

// Obtener todos los profesores
const getTeachers = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM teachers');
    res.status(200).json(rows);
  } catch (error) {
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
    console.log('Datos recibidos en el servidor:', req.body);
    
    const { name, phone, email, subjects, status } = req.body;

    // Validar datos requeridos
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios (nombre, email, teléfono)' 
      });
    }

    // Primero crear el profesor
    const [result] = await sequelize.query(
      'INSERT INTO teachers (name, phone, email, status) VALUES (?, ?, ?, ?)',
      {
        replacements: [name, phone, email, status || 'activo']
      }
    );

    const teacherId = result.insertId;

    // Luego insertar las asignaturas si existen
    if (subjects && subjects.length > 0) {
      for (const subject of subjects) {
        await sequelize.query(
          'INSERT INTO teacher_subjects (teacher_id, subject_name) VALUES (?, ?)',
          {
            replacements: [teacherId, subject]
          }
        );
      }
    }

    res.status(201).json({
      id: teacherId,
      name,
      email,
      phone,
      subjects,
      status: status || 'activo'
    });

  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ 
      error: 'Error al crear el profesor',
      details: error.message 
    });
  }
};

// Actualizar un profesor existente
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, status } = req.body;
    const [result] = await sequelize.query('UPDATE teachers SET name = ?, phone = ?, email = ?, status = ? WHERE idteacher = ?', [name, phone, email, status, id]);
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
    const [result] = await sequelize.query('DELETE FROM teachers WHERE idteacher = ?', [id]);
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