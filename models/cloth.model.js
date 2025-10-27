const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Cloth = sequelize.define(
  "Cloth",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clothTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cloth_types",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
      comment: "Reference to the type of clothing (Hijab, Gown, etc.)",
    },
    colour: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    imageName: {
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

module.exports = Cloth;
