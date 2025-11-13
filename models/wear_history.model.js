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
    },
    outfitId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dateWorn: {
      type: DataTypes.DATEONLY,
      allowNull: false,
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
