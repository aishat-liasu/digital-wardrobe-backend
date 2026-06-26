import { setDefaultResultOrder } from "node:dns";
setDefaultResultOrder("ipv4first");
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { testConnection, migrator, seeder, sequelize } from "./config/db.js";
import errorMiddleware from "./middleware/errorHandler.middleware.js";
import { config } from "./config/index.js";
import { logger, stream } from "./utils/logger.js";
import { globalLimiter } from "./middleware/rateLimiter.middleware.js";

// Routes
import AuthRoutes from "./routes/auth.routes.js";
import UserRoutes from "./routes/user.routes.js";
import StorageRoutes from "./routes/storage.routes.js";

import ClothStatusRoutes from "./routes/clothStatus.routes.js";
import ClothTypeRoutes from "./routes/clothType.routes.js";
import ClothRoutes from "./routes/cloth.routes.js";

import OutfitOccasionRoutes from "./routes/outfitOccasion.routes.js";
import OutfitTagRoutes from "./routes/outfitTag.routes.js";
import OutfitRoutes from "./routes/outfit.routes.js";

import WearHistoryRoutes from "./routes/wearHistory.routes.js";
import DashboardRoutes from "./routes/dashboard.routes.js";

export class App {
  constructor(routes) {
    this.app = express();
    this.env = config.env;
    this.port = config.port;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  listen() {
    return this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  async initializeDatabase() {
    await testConnection();

    // Run Migrations
    if (config.app.runMigrations) {
      logger.info("Checking for pending migrations...");

      try {
        const migrations = await migrator.up();
        if (migrations.length > 0) {
          logger.info(`Executed ${migrations.length} migrations`, migrations);
        } else {
          logger.info("Database is up to date (no new migrations).");
        }
      } catch (err) {
        logger.error("Migration Failed:", err);
        process.exit(1);
      }
    } else {
      logger.info("Skipping Migrations...");
    }

    // Run Seeders
    if (config.app.runSeeders) {
      logger.info("Running seeders...");
      try {
        await seeder.up();
        logger.info("Seeders executed successfully.");
      } catch (err) {
        logger.error("Seeding Failed:", err);
        process.exit(1);
      }
    } else {
      logger.info("Skipping Seeders...");
    }
  }

  initializeMiddlewares() {
    this.app.use(morgan(config.logger.format, { stream }));
    this.app.use(cors({ origin: config.app.corsOrigin, credentials: config.app.corsCredentials }));
    this.app.use(helmet());
    this.app.use(globalLimiter);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
    this.app.get("/", (req, res) => {
      res.status(200).json({ message: "Digital Wardrobe API is working" });
    });
    this.app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

const startServer = async () => {
  const app = new App([
    new AuthRoutes(),
    new UserRoutes(),
    new ClothTypeRoutes(),
    new ClothStatusRoutes(),
    new StorageRoutes(),
    new ClothRoutes(),
    new OutfitOccasionRoutes(),
    new OutfitTagRoutes(),
    new OutfitRoutes(),
    new WearHistoryRoutes(),
    new DashboardRoutes(),
  ]);

  try {
    await app.initializeDatabase();

    const server = app.listen();

    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        logger.info("Closed Express server.");
        try {
          await sequelize.close();
          logger.info("Database connection closed.");
          process.exit(0);
        } catch (err) {
          logger.error("Error during database disconnection:", err);
          process.exit(1);
        }
      });

      // Force close if it takes too long
      setTimeout(() => {
        logger.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  } catch (err) {
    logger.error("Critical Failure during startup:", err);
    process.exit(1);
  }
};

startServer();
