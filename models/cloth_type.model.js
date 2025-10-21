const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ClothType = sequelize.define(
  "ClothType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "The actual type of clothing (Hijab, Gown, etc.)",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "cloth_types",
    timestamps: false,
  },
);

module.exports = ClothType;
