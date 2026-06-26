import { DataTypes, Deferrable } from "sequelize";
import { sequelize } from "../config/db.js";

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
    colours: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    imageName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imagePath: {
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
  }
);

export default Cloth;
