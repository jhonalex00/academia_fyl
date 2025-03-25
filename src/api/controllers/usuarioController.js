const { Usuario } = require('../../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] } // No enviamos las contraseñas
    });
    
    res.status(200).json({ 
      success: true, 
      data: usuarios 
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuarios', 
      error: error.message 
    });
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: usuario 
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuario', 
      error: error.message 
    });
  }
};

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
  try {
    const { nombre, password, rol } = req.body;
    
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const nuevoUsuario = await Usuario.create({
      nombre,
      password: hashedPassword,
      rol
    });
    
    // No devolver la contraseña
    const usuarioResponse = {
      iduser: nuevoUsuario.iduser,
      nombre: nuevoUsuario.nombre,
      rol: nuevoUsuario.rol
    };
    
    res.status(201).json({ 
      success: true, 
      data: usuarioResponse,
      message: 'Usuario creado exitosamente' 
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear usuario', 
      error: error.message 
    });
  }
};

// Autenticar un usuario
const loginUsuario = async (req, res) => {
  try {
    const { nombre, password } = req.body;
    
    // Verificar que el usuario existe
    const usuario = await Usuario.findOne({ where: { nombre } });
    
    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar JWT
    const payload = {
      usuario: {
        id: usuario.iduser,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secreto', // Usar variable de entorno o un valor por defecto
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          token,
          usuario: {
            id: usuario.iduser,
            nombre: usuario.nombre,
            rol: usuario.rol
          }
        });
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  
  try {
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // Si se actualiza la contraseña, encriptarla primero
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    
    await usuario.update(req.body);
    
    // No devolver la contraseña en la respuesta
    const usuarioResponse = {
      iduser: usuario.iduser,
      nombre: usuario.nombre,
      rol: usuario.rol
    };
    
    res.status(200).json({ 
      success: true, 
      data: usuarioResponse,
      message: 'Usuario actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar usuario', 
      error: error.message 
    });
  }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  
  try {
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    await usuario.destroy();
    
    res.status(200).json({ 
      success: true, 
      message: 'Usuario eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar usuario', 
      error: error.message 
    });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  loginUsuario,
  updateUsuario,
  deleteUsuario
};