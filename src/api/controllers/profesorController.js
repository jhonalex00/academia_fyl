const { Profesor, Mensaje } = require('../../models/index');

// Obtener todos los profesores
const getProfesores = async (req, res) => {
  try {
    const profesores = await Profesor.findAll({
      include: [{ model: Mensaje }]
    });
    
    res.status(200).json({ 
      success: true, 
      data: profesores 
    });
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener profesores', 
      error: error.message 
    });
  }
};

// Obtener un profesor por ID
const getProfesorById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const profesor = await Profesor.findByPk(id, {
      include: [{ model: Mensaje }]
    });
    
    if (!profesor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profesor no encontrado' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: profesor 
    });
  } catch (error) {
    console.error('Error al obtener profesor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener profesor', 
      error: error.message 
    });
  }
};

// Crear un nuevo profesor
const createProfesor = async (req, res) => {
  try {
    const nuevoProfesor = await Profesor.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      data: nuevoProfesor,
      message: 'Profesor creado exitosamente' 
    });
  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear profesor', 
      error: error.message 
    });
  }
};

// Actualizar un profesor
const updateProfesor = async (req, res) => {
  const { id } = req.params;
  
  try {
    const profesor = await Profesor.findByPk(id);
    
    if (!profesor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profesor no encontrado' 
      });
    }
    
    await profesor.update(req.body);
    
    res.status(200).json({ 
      success: true, 
      data: profesor,
      message: 'Profesor actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar profesor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar profesor', 
      error: error.message 
    });
  }
};

// Eliminar un profesor
const deleteProfesor = async (req, res) => {
  const { id } = req.params;
  
  try {
    const profesor = await Profesor.findByPk(id);
    
    if (!profesor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profesor no encontrado' 
      });
    }
    
    await profesor.destroy();
    
    res.status(200).json({ 
      success: true, 
      message: 'Profesor eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar profesor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar profesor', 
      error: error.message 
    });
  }
};

module.exports = {
  getProfesores,
  getProfesorById,
  createProfesor,
  updateProfesor,
  deleteProfesor
};