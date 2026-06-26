"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const occasions = [
      { name: "Casual" },
      { name: "Work / Professional" },
      { name: "Date Night" },
      { name: "Party / Night Out" },
      { name: "Formal Event" },
      { name: "Gym / Active" },
      { name: "Vacation / Beach" },
      { name: "Loungewear / Home" },
      { name: "Religious / Modest" },
      { name: "Running Errands" },
      { name: "Weekends" },
    ];

    await queryInterface.bulkInsert("outfit_occasions", occasions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("outfit_occasions", null, {});
  },
};
