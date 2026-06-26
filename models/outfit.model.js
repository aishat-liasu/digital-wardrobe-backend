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
      references: { model: "users", key: "id" },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occasionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "outfit_occasions", key: "id" },
    },
    description: { type: DataTypes.TEXT, allowNull: false },
    isFavourite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    wearCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastWornAt: { type: DataTypes.DATEONLY },
  },
  {
    tableName: "outfits",
    timestamps: true,
  }
);

export default Outfit;
