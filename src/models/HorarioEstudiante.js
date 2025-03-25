const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const HorarioEstudiante = sequelize.define('HorarioEstudiante', {
  idEstudiante: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idstudent',
    references: {
      model: 'students',
      key: 'idstudent'
    }
  },
  idHorario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idschedule',
    references: {
      model: 'schedules',
      key: 'idschedule'
    }
  },
  idAsignatura: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idsubject',
    references: {
      model: 'subjects',
      key: 'idsubject'
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'status'
  }
}, {
  tableName: 'schedules_students',
  timestamps: false
});

module.exports = HorarioEstudiante;