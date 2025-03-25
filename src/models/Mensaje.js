const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Mensaje = sequelize.define('Mensaje', {
  idmessage: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idmessage'
  },
  mensaje: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'message'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date'
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'hour'
  },
  idContacto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idcontact',
    references: {
      model: 'contacts',
      key: 'idcontact'
    }
  },
  idProfesor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idteacher',
    references: {
      model: 'teachers',
      key: 'idteacher'
    }
  }
}, {
  tableName: 'messages',
  timestamps: false
});

module.exports = Mensaje;