const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Horario = sequelize.define('Horario', {
  idschedule: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idschedule'
  },
  horaInicio: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'startHour'
  },
  diaSemana: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'weekDay'
  }
}, {
  tableName: 'schedules',
  timestamps: false
});

module.exports = Horario;