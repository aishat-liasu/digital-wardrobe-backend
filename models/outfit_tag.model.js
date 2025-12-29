import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const OutfitTag = sequelize.define(
  "OutfitTag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "outfit_tags",
    timestamps: false,
  }
);

export default OutfitTag;
