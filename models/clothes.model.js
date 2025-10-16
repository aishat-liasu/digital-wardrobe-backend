const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const Clothes = sequelize.define(
  "Clothes",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cloth_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "cloth_types",
        key: "id",
      },
      comment: "Reference to the type of clothing (Hijab, Gown, etc.)",
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "clothes",
    timestamps: true,
  },
);

module.exports = Clothes;
