"use strict";

const { DataTypes, Deferrable } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cloth_status_map", {
      clothId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "clothes",
          key: "id",
          deferrable: Deferrable.INITIALLY_DEFERRED,
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("cloth_status_map");
  },
};
