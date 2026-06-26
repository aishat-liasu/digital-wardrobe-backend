"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("cloth_types", [
      {
        name: "Hijab",
        description: "A traditional head covering worn by Muslim women.",
      },
      {
        name: "Gown",
        description: "A long flowing dress, often worn for formal occasions.",
      },
      {
        name: "T-Shirt",
        description: "A casual short-sleeved shirt made of cotton fabric.",
      },
      {
        name: "Jeans",
        description: "Denim trousers suitable for casual wear.",
      },
      {
        name: "Abaya",
        description: "A loose-fitting full-length robe traditionally worn by some Muslim women.",
      },
      {
        name: "Kaftan",
        description: "A loose, long-sleeved garment with a flowing design.",
      },
      {
        name: "Tops",
        description: "A general term for upper body clothing, such as blouses or shirts.",
      },
      {
        name: "Skirt",
        description: "A garment that hangs from the waist and covers part or all of the legs.",
      },
      {
        name: "Trousers",
        description: "A pair of garments covering each leg separately, from waist to ankle.",
      },
      {
        name: "Shorts",
        description: "Shortened trousers covering the upper part of the legs.",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cloth_types", null, {});
  },
};
