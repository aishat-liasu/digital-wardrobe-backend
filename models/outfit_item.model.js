const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const OutfitItem = sequelize.define(
  "OutfitItem",
  {
    outfitId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    clothId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "outfit_items",
    timestamps: true,
  },
);

module.exports = OutfitItem;
