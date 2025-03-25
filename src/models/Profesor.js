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
  }
}, {
  tableName: 'teachers',
  timestamps: false
});

module.exports = Profesor;