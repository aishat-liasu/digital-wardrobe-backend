const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const Outfit = sequelize.define(
  "Outfit",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_worn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "outfits",
    timestamps: true,
  },
);

module.exports = Outfit;
