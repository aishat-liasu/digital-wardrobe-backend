const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ClothStatus = sequelize.define(
  "ClothStatus",
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
      comment: "The actual status of clothing (New, Old, etc.)",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "cloth_statuses",
    timestamps: false,
  },
);

module.exports = ClothStatus;
