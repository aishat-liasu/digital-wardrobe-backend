import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { testConnection, migrator, seeder } from "./config/db.js";
import errorMiddleware from "./middleware/errorHandler.middleware.js";
import { logger } from "./utils/logger.js";

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

export class App {
  constructor(routes) {
    this.app = express();
    this.env = process.env.NODE_ENV || "development";
    this.port = process.env.PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  async initializeDatabase() {
    await testConnection();

    // Run Migrations
    if (process.env.RUN_MIGRATIONS === "true") {
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
    if (process.env.RUN_SEEDERS === "true") {
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
    //this.app.use(morgan(LOG_FORMAT, { stream }));
    //this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));

    this.app.use(morgan(process.env.NODE_ENV));
    this.app.use(cors({ origin: "http://localhost:5173", credentials: true }));
    this.app.use(helmet());
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
  ]);

  try {
    await app.initializeDatabase();
    app.listen();
  } catch (err) {
    logger.error("Critical Failure during startup:", err);
    process.exit(1);
  }
};

startServer();
