const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Contacto = sequelize.define('Contacto', {
  idcontact: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idcontact'
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'phone'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'name'
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'email'
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'password'
  }
}, {
  tableName: 'contacts',
  timestamps: false
});

module.exports = Contacto;