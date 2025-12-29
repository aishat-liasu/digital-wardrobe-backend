import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const OutfitTagMap = sequelize.define(
  "OutfitTagMap",
  {
    outfitId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: { model: "outfits", key: "id" },
      onDelete: "CASCADE",
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: "outfit_tags", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "outfit_tag_map",
    timestamps: true,
  }
);

export default OutfitTagMap;
