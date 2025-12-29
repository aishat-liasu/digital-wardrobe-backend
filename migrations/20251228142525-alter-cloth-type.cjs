"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("cloth_types", "displayPriority", {
      type: Sequelize.INTEGER,
      defaultValue: 100,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("cloth_types", "displayPriority");
  },
};
