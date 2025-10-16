const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const ClothStatusMap = sequelize.define(
  "ClothStatusMap",
  {
    cloth_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    cloth_status_id: {
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
