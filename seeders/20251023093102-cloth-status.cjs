"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("cloth_statuses", [
      {
        name: "New",
        description: "Recently purchased or unworn clothes",
      },
      {
        name: "Old",
        description: "Previously used or older clothes",
      },
      {
        name: "House Wear",
        description: "Casual clothing worn at home",
      },
      {
        name: "Event Wear",
        description: "Clothing reserved for outings or special occasions",
      },
      {
        name: "Damaged",
        description: "Clothes with tears, burns, or other defects",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("cloth_statuses", null, {});
  },
};
