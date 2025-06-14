const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/config"); // ✅ esta línea es clave

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id", // ✅ Este es el nombre real de la columna
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "nombre", // ✅ corregido anteriormente
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "password",
    },
    idacademy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "idacademy",
    },
  },
  {
    tableName: "usuarios", // ✅ nombre correcto
    timestamps: false,
  }
);
