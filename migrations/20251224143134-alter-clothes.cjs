"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn("clothes", "colour", "colours", {
        transaction,
      });

      await queryInterface.addColumn(
        "clothes",
        "imagePath",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn("clothes", "imagePath", {
        transaction,
      });

      await queryInterface.renameColumn("clothes", "colours", "colour", {
        transaction,
      });
    });
  },
};
