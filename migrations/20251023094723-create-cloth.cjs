"use strict";

const { DataTypes, Deferrable } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("clothes", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
    await queryInterface.dropTable("clothes");
  },
};
