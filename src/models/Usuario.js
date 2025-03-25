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
  rol: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'rol'
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = Usuario;