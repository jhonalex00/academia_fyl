const { Horario, HorarioEstudiante } = require('../../models/index');

// Obtener todos los horarios
const getHorarios = async (req, res) => {
  try {
    const horarios = await Horario.findAll({
      include: [{ model: HorarioEstudiante }]
    });
    
    res.status(200).json({ 
      success: true, 
      data: horarios 
    });
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener horarios', 
      error: error.message 
    });
  }
};

// Obtener un horario por ID
const getHorarioById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const horario = await Horario.findByPk(id, {
      include: [{ model: HorarioEstudiante }]
    });
    
    if (!horario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Horario no encontrado' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: horario 
    });
  } catch (error) {
    console.error('Error al obtener horario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener horario', 
      error: error.message 
    });
  }
};

// Crear un nuevo horario
const createHorario = async (req, res) => {
  try {
    const nuevoHorario = await Horario.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      data: nuevoHorario,
      message: 'Horario creado exitosamente' 
    });
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear horario', 
      error: error.message 
    });
  }
};

// Actualizar un horario
const updateHorario = async (req, res) => {
  const { id } = req.params;
  
  try {
    const horario = await Horario.findByPk(id);
    
    if (!horario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Horario no encontrado' 
      });
    }
    
    await horario.update(req.body);
    
    res.status(200).json({ 
      success: true, 
      data: horario,
      message: 'Horario actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar horario', 
      error: error.message 
    });
  }
};

// Eliminar un horario
const deleteHorario = async (req, res) => {
  const { id } = req.params;
  
  try {
    const horario = await Horario.findByPk(id);
    
    if (!horario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Horario no encontrado' 
      });
    }
    
    await horario.destroy();
    
    res.status(200).json({ 
      success: true, 
      message: 'Horario eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar horario', 
      error: error.message 
    });
  }
};

module.exports = {
  getHorarios,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario
};