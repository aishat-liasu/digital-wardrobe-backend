import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const OutfitOccasion = sequelize.define(
  "OutfitOccasion",
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
  },
  {
    tableName: "outfit_occasions",
    timestamps: false,
  }
);

export default OutfitOccasion;
