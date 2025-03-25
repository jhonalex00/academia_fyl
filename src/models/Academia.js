const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Academia = sequelize.define('Academia', {
  idacademy: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idacademy'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'name'
  },
  direccion: {
    type: DataTypes.CHAR(50),
    allowNull: true,
    field: 'adress' // Mantengo el nombre del campo como en la base de datos, aunque tenga un error ortográfico
  },
  telefono: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'phone'
  }
}, {
  tableName: 'academies',
  timestamps: false
});

module.exports = Academia;