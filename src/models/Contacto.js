const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Contacto = sequelize.define('Contacto', {
  idcontact: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idcontact'
  },
  numeroContacto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'numberContact'
  },
  nombreContacto: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'nameContact'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'email'
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'password'
  },
  idEstudiante: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idstudent',
    references: {
      model: 'students',
      key: 'idstudent'
    }
  }
}, {
  tableName: 'contacts',
  timestamps: false
});

module.exports = Contacto;