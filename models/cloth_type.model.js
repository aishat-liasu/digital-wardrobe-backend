import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClothType = sequelize.define(
  "ClothType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "The actual type of clothing (Hijab, Gown, etc.)",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    displayPriority: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false,
    },
  },
  {
    tableName: "cloth_types",
    timestamps: false,
  }
);

export default ClothType;
