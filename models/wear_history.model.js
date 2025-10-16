const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const WearHistory = sequelize.define(
  "WearHistory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    outfit_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    date_worn: {
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
  },
);

module.exports = WearHistory;
