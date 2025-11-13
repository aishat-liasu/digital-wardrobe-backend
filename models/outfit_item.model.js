import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

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
  }
);

export default OutfitItem;
