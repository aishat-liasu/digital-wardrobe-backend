"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tags = [
      { name: "Summer", category: "Weather" },
      { name: "Winter", category: "Weather" },
      { name: "Rainy Day", category: "Weather" },
      { name: "Sunny", category: "Weather" },
      { name: "Cold", category: "Weather" },
      { name: "Harmattan", category: "Weather" },

      { name: "Chic", category: "Vibe" },
      { name: "Modest", category: "Vibe" },
      { name: "Minimalist", category: "Vibe" },
      { name: "Streetwear", category: "Vibe" },
      { name: "Boho", category: "Vibe" },
      { name: "Elegant", category: "Vibe" },
      { name: "Vintage", category: "Vibe" },
      { name: "Bold", category: "Vibe" },

      { name: "Comfortable", category: "Functional" },
      { name: "Oversized", category: "Functional" },
      { name: "Lightweight", category: "Functional" },
      { name: "Quick Outfit", category: "Functional" },
    ];

    await queryInterface.bulkInsert("outfit_tags", tags, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("outfit_tags", null, {});
  },
};
