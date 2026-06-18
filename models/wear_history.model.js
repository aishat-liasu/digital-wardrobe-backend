import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const WearHistory = sequelize.define(
  "WearHistory",
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
    outfitId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "outfits", key: "id" },
    },
    dateWorn: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "wear_history",
    timestamps: true,
  }
);

export default WearHistory;
