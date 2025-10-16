const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const OutfitItem = sequelize.define(
  "OutfitItem",
  {
    outfit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    cloth_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true, // e.g., "Pair with gold accessories"
    },
  },
  {
    tableName: "outfit_items",
    timestamps: true,
  },
);

module.exports = OutfitItem;
