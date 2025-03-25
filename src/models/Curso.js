const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Asignatura = sequelize.define('Asignatura', {
  idsubject: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idsubject'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'name'
  },
  curso: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'course'
  },
  ciclo: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'cycle'
  }
}, {
  tableName: 'subjects',
  timestamps: false
});

module.exports = Asignatura;