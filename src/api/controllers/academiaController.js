const { Academia } = require('../models/index');

// Obtener todas las academias
const getAcademias = async (req, res) => {
  try {
    const academias = await Academia.findAll();
    res.status(200).json({ 
      success: true, 
      data: academias 
    });
  } catch (error) {
    console.error('Error al obtener academias:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener academias', 
      error: error.message 
    });
  }
};

// Obtener una academia por ID
const getAcademiaById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const academia = await Academia.findByPk(id);
    
    if (!academia) {
      return res.status(404).json({ 
        success: false, 
        message: 'Academia no encontrada' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: academia 
    });
  } catch (error) {
    console.error('Error al obtener academia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener academia', 
      error: error.message 
    });
  }
};

// Crear una nueva academia
const createAcademia = async (req, res) => {
  try {
    const nuevaAcademia = await Academia.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: nuevaAcademia,
      message: 'Academia creada exitosamente' 
    });
  } catch (error) {
    console.error('Error al crear academia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear academia', 
      error: error.message 
    });
  }
};

// Actualizar una academia
const updateAcademia = async (req, res) => {
  const { id } = req.params;
  
  try {
    const academia = await Academia.findByPk(id);
    
    if (!academia) {
      return res.status(404).json({ 
        success: false, 
        message: 'Academia no encontrada' 
      });
    }
    
    await academia.update(req.body);
    
    res.status(200).json({ 
      success: true, 
      data: academia,
      message: 'Academia actualizada exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar academia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar academia', 
      error: error.message 
    });
  }
};

// Eliminar una academia
const deleteAcademia = async (req, res) => {
  const { id } = req.params;
  
  try {
    const academia = await Academia.findByPk(id);
    
    if (!academia) {
      return res.status(404).json({ 
        success: false, 
        message: 'Academia no encontrada' 
      });
    }
    
    await academia.destroy();
    
    res.status(200).json({ 
      success: true, 
      message: 'Academia eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar academia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar academia', 
      error: error.message 
    });
  }
};

module.exports = {
  getAcademias,
  getAcademiaById,
  createAcademia,
  updateAcademia,
  deleteAcademia
};