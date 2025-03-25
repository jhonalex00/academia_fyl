const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Inscripcion = sequelize.define('Inscripcion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estudianteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Estudiantes',
      key: 'id'
    }
  },
  cursoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Cursos',
      key: 'id'
    }
  },
  fechaInscripcion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fechaBaja: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activa', 'inactiva', 'pendiente'),
    defaultValue: 'activa'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Inscripcion;