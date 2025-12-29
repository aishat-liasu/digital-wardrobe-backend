"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("outfit_items", {
      outfitId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "outfits", key: "id" },
        onDelete: "CASCADE",
      },
      clothId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "clothes", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("outfit_items");
  },
};
