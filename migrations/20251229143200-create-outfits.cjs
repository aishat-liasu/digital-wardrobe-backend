"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("outfits", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      occasionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "outfit_occasions", key: "id" },
        onUpdate: "CASCADE",
      },
      imagePath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isFavourite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      wearCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      lastWornAt: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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
    await queryInterface.dropTable("outfits");
  },
};
