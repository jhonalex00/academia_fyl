const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Estudiante = sequelize.define('Estudiante', {
  idstudent: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idstudent'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'name'
  },
  dni: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'dni'
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'birthDate'
  },
  idcontacto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idcontact'
  }
}, {
  tableName: 'students',
  timestamps: false
});

module.exports = Estudiante;