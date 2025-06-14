const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../db/config");

const JWT_SECRET = process.env.JWT_SECRET || "academia-fyl-secret-key";

// Función para iniciar sesión como usuario (admin, profesor, padre) según rol
const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ error: "Se requieren nombre y contraseña" });
    }

    // Buscar usuario en base de datos
    const Usuario = require("../../models/Usuario");

    const user = await Usuario.findOne({ where: { nombre: name } }); // nombre correcto

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Comparar contraseña directamente
    const passwordMatch = password === user.password;

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Crear token con campos correctos
    const token = jwt.sign(
      {
        id: user.id, // corregido
        name: user.nombre,
        role: user.rol,
        academyId: user.idacademy,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id, // corregido
        name: user.nombre,
        role: user.rol,
        academyId: user.idacademy,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para iniciar sesión como profesor
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Se requieren email y contraseña' });
    }

    const Profesor = require('../../models/Profesor');
    const teacher = await Profesor.findOne({ where: { email } });

    // 🔍 Agrega este console.log aquí:
    console.log('teacher:', teacher);

    if (!teacher) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const passwordMatch = password === teacher.password;

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    if (teacher.status !== 'active') {
      return res.status(403).json({ error: 'Su cuenta está desactivada. Contacte a un administrador.' });
    }

    const token = jwt.sign(
      {
        id: teacher.idteacher,
        name: teacher.nombre, // ✅ Usa teacher.nombre, no teacher.name
        role: 'teacher',
        email: teacher.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: teacher.idteacher,
        name: teacher.nombre,
        role: 'teacher',
        email: teacher.email
      }
    });
  } catch (error) {
    console.error('Error en login de profesor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Función para iniciar sesión como contacto (padre/tutor)
const loginContact = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se requieren email y contraseña" });
    }

    const Contacto = require("../../models/Contacto");
    const contact = await Contacto.findOne({
      where: { email },
      attributes: ["idcontact", "phone", "name", "email", "password"],
    });

    if (!contact) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const passwordMatch = password === contact.password;

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      {
        id: contact.idcontact,
        name: contact.name,
        role: "parent",
        email: contact.email,
        phone: contact.phone,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso como padre",
      token,
      user: {
        id: contact.idcontact,
        name: contact.name,
        role: "parent",
        email: contact.email,
        phone: contact.phone,
      },
    });
  } catch (error) {
    console.error("Error en login de contacto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Verificar token
const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "No autorizado, token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: "Token inválido o expirado" });
  }
};

// Obtener información del usuario actual basado en su token
const getCurrentUser = (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = {
  loginUser,
  loginTeacher,
  loginContact,
  verifyToken,
  getCurrentUser,
};
