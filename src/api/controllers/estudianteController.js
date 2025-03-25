const { Estudiante, Contacto, HorarioEstudiante, Horario, Asignatura } = require('../../models/index');

// Obtener todos los estudiantes
const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll({
      include: [
        { model: Contacto },
        { 
          model: HorarioEstudiante,
          include: [Horario, Asignatura]
        }
      ]
    });
    
    res.status(200).json({ 
      success: true, 
      data: estudiantes 
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estudiantes', 
      error: error.message 
    });
  }
};

// Obtener un estudiante por ID
const getEstudianteById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const estudiante = await Estudiante.findByPk(id, {
      include: [
        { model: Contacto },
        { 
          model: HorarioEstudiante,
          include: [Horario, Asignatura]
        }
      ]
    });
    
    if (!estudiante) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: estudiante 
    });
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estudiante', 
      error: error.message 
    });
  }
};

// Crear un nuevo estudiante
const createEstudiante = async (req, res) => {
  try {
    const nuevoEstudiante = await Estudiante.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      data: nuevoEstudiante,
      message: 'Estudiante creado exitosamente' 
    });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear estudiante', 
      error: error.message 
    });
  }
};

// Actualizar un estudiante
const updateEstudiante = async (req, res) => {
  const { id } = req.params;
  
  try {
    const estudiante = await Estudiante.findByPk(id);
    
    if (!estudiante) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }
    
    await estudiante.update(req.body);
    
    res.status(200).json({ 
      success: true, 
      data: estudiante,
      message: 'Estudiante actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar estudiante', 
      error: error.message 
    });
  }
};

// Eliminar un estudiante
const deleteEstudiante = async (req, res) => {
  const { id } = req.params;
  
  try {
    const estudiante = await Estudiante.findByPk(id);
    
    if (!estudiante) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }
    
    await estudiante.destroy();
    
    res.status(200).json({ 
      success: true, 
      message: 'Estudiante eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar estudiante', 
      error: error.message 
    });
  }
};

module.exports = {
  getEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante
};