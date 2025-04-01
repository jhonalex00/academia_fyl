const { sequelize } = require('../../db/config');

// Obtener todos los estudiantes
const getStudents = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM students');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los estudiantes' });
  }
};

// Obtener un estudiante por ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await sequelize.query('SELECT * FROM students WHERE idstudent = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el estudiante' });
  }
};

// Crear un nuevo estudiante
const createStudent = async (req, res) => {
  try {
    const { name, surname, dni, birthDate, status, phone, email, divorced, knowUs, repeat, yearRepeat, disorder, allergy, mobilityProblem, bullying, observation, idacademy, idenrolment } = req.body;
    const [result] = await sequelize.query(
      'INSERT INTO students (name, surname, dni, birthDate, status, phone, email, divorced, knowUs, repeat, yearRepeat, disorder, allergy, mobilityProblem, bullying, observation, idacademy, idenrolment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, surname, dni, birthDate, status, phone, email, divorced, knowUs, repeat, yearRepeat, disorder, allergy, mobilityProblem, bullying, observation, idacademy, idenrolment]
    );
    res.status(201).json({ id: result.insertId, name, surname, dni, birthDate, status, phone, email, divorced, knowUs, repeat, yearRepeat, disorder, allergy, mobilityProblem, bullying, observation, idacademy, idenrolment });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el estudiante' });
  }
};

// Actualizar un estudiante existente
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, dni, birthDate, status, phone, email, divorced, knowUs, repeat, yearRepeat, disorder, allergy, mobilityProblem, bullying, observation, idacademy, idenrolment } = req.body;
    const [result] = await sequelize.query(
      'UPDATE students SET name = ?, surname = ?, dni = ?, birthDate = ?, status = ?, phone = ?, email = ?, divorced = ?, knowUs = ?, repeat = ?, yearRepeat = ?, disorder = ?, allergy = ?, mobilityProblem = ?, bullying = ?, observation = ?, idacademy = ?, idenrolment = ? WHERE idstudent = ?',
      [name, surname, dni, birthDate, status, phone, email, divorced, knowUs, repeat, yearRepeat, disorder, allergy, mobilityProblem, bullying, observation, idacademy, idenrolment, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.status(200).json({ id, name, surname, dni, birthDate, status, phone, email, divorced, knowUs, repeat, yearRepeat, disorder, allergy, mobilityProblem, bullying, observation, idacademy, idenrolment });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estudiante' });
  }
};

// Eliminar un estudiante
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await sequelize.query('DELETE FROM students WHERE idstudent = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.status(200).json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el estudiante' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};