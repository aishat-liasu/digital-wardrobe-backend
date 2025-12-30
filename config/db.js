import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { Client } from "pg";
import { logger } from "../utils/logger.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    benchmark: true,
  }
);

const migrator = new Umzug({
  migrations: {
    glob: [`migrations/*.cjs`],
    resolve: ({ name, path, context }) => {
      const migration = require(path);

      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },

  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// Seeder needs a different storage table so it doesn't conflict with migrations
const seeder = new Umzug({
  migrations: {
    glob: [`seeders/*.cjs`],
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: "SequelizeData_Seeders",
    tableName: "SequelizeData_Seeders",
  }),
  logger: console,
});

const createDbIfNotExists = async () => {
  const dbName = process.env.DB_NAME;

  // Connect to the default 'postgres' database first
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: "postgres",
  });

  try {
    await client.connect();

    // Check if database exists
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      logger.info(`Database "${dbName}" created successfully.`);
    } else {
      logger.info(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    logger.error("Failed to check/create database:", error);
    throw error; // Stop the app if we can't ensure DB exists
  } finally {
    await client.end();
  }
};

const testConnection = async () => {
  try {
    await createDbIfNotExists();
    await sequelize.authenticate();

    logger.info("Database Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    logger.error("Unable to connect to the database:", error);
    throw error;
  }
};

export { sequelize, testConnection, migrator, seeder };
