const { Asignatura, HorarioEstudiante } = require('../../models/index');

// Obtener todas las asignaturas
const getAsignaturas = async (req, res) => {
  try {
    const asignaturas = await Asignatura.findAll({
      include: [{ model: HorarioEstudiante }]
    });
    
    res.status(200).json({ 
      success: true, 
      data: asignaturas 
    });
  } catch (error) {
    console.error('Error al obtener asignaturas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener asignaturas', 
      error: error.message 
    });
  }
};

// Obtener una asignatura por ID
const getAsignaturaById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const asignatura = await Asignatura.findByPk(id, {
      include: [{ model: HorarioEstudiante }]
    });
    
    if (!asignatura) {
      return res.status(404).json({ 
        success: false, 
        message: 'Asignatura no encontrada' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: asignatura 
    });
  } catch (error) {
    console.error('Error al obtener asignatura:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener asignatura', 
      error: error.message 
    });
  }
};

// Crear una nueva asignatura
const createAsignatura = async (req, res) => {
  try {
    const nuevaAsignatura = await Asignatura.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      data: nuevaAsignatura,
      message: 'Asignatura creada exitosamente' 
    });
  } catch (error) {
    console.error('Error al crear asignatura:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear asignatura', 
      error: error.message 
    });
  }
};

// Actualizar una asignatura
const updateAsignatura = async (req, res) => {
  const { id } = req.params;
  
  try {
    const asignatura = await Asignatura.findByPk(id);
    
    if (!asignatura) {
      return res.status(404).json({ 
        success: false, 
        message: 'Asignatura no encontrada' 
      });
    }
    
    await asignatura.update(req.body);
    
    res.status(200).json({ 
      success: true, 
      data: asignatura,
      message: 'Asignatura actualizada exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar asignatura:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar asignatura', 
      error: error.message 
    });
  }
};

// Eliminar una asignatura
const deleteAsignatura = async (req, res) => {
  const { id } = req.params;
  
  try {
    const asignatura = await Asignatura.findByPk(id);
    
    if (!asignatura) {
      return res.status(404).json({ 
        success: false, 
        message: 'Asignatura no encontrada' 
      });
    }
    
    await asignatura.destroy();
    
    res.status(200).json({ 
      success: true, 
      message: 'Asignatura eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar asignatura:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar asignatura', 
      error: error.message 
    });
  }
};

module.exports = {
  getAsignaturas,
  getAsignaturaById,
  createAsignatura,
  updateAsignatura,
  deleteAsignatura
};