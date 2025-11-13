import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClothStatusMap = sequelize.define(
  "ClothStatusMap",
  {
    clothId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "clothes",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
    },
    clothStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "cloth_statuses",
        key: "id",
        deferrable: Deferrable.INITIALLY_DEFERRED,
      },
    },
  },
  {
    tableName: "cloth_status_map",
    timestamps: true,
  }
);

export default ClothStatusMap;
