const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Usuario = sequelize.define('Usuario', {
  iduser: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'iduser'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'name'
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'password'
  },
  idacademy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idacademy'
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = Usuario;