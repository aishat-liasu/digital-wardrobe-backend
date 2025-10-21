const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ClothStatusMap = sequelize.define(
  "ClothStatusMap",
  {
    clothId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    clothStatusId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "cloth_status_map",
    timestamps: false,
  },
);

module.exports = ClothStatusMap;
