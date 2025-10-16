const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const ClothStatus = sequelize.define(
  "ClothStatus",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
