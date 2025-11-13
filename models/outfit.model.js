import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Outfit = sequelize.define(
  "Outfit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dateWorn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "outfits",
    timestamps: true,
  }
);

export default Outfit;
