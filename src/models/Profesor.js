const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Profesor = sequelize.define('Profesor', {
  idteacher: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idteacher'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'name'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'email'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'phone'
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'password'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'status',
    defaultValue: 'active'
  }
}, {
  tableName: 'teachers',
  timestamps: false
});

module.exports = Profesor;