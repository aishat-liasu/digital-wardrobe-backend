import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { Client } from "pg";
import { logger } from "../utils/logger.js";
import { createRequire } from "module";

import { config } from "./index.js";

const require = createRequire(import.meta.url);

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: false,
    benchmark: true,
    pool: {
      max: config.db.poolMax,
      min: config.db.poolMin,
      acquire: 30000, // Maximum time (ms) to wait for a connection
      idle: 10000   // Maximum time (ms) a connection can be idle before being released
    },
    ...(config.env === "production" && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
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
  const dbName = config.db.name;

  const client = new Client({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    database: "postgres",
    ...(config.env === "production" && {
      ssl: {
        rejectUnauthorized: false
      }
    })
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
