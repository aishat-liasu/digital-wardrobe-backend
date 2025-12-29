import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const OutfitItem = sequelize.define(
  "OutfitItem",
  {
    outfitId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: { model: "outfits", key: "id" },
      onDelete: "CASCADE",
    },
    clothId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: { model: "clothes", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "outfit_items",
    timestamps: true,
  }
);

export default OutfitItem;
