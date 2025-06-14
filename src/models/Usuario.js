const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/config"); // ✅ esta línea es clave

const Usuario = sequelize.define(
  "Usuario",
  {
    iduser: {
      // 👈 Esto debe mapearse al campo real "id"
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "nombre",
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
    rol: {
      type: DataTypes.ENUM("admin", "profesor", "padre"),
      allowNull: false,
      field: "rol",
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);
