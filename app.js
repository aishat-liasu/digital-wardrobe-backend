import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { testConnection } from "./config/db.js";
import errorMiddleware from "./middleware/errorHandler.middleware.js";
import { logger } from "./utils/logger.js";
import AuthRoutes from "./routes/auth.routes.js";
import UserRoutes from "./routes/user.routes.js";

export class App {
  constructor(routes) {
    this.app = express();
    this.env = process.env.NODE_ENV || "development";
    this.port = process.env.PORT || 3000;

    this.connectToDatabase();
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

  getServer() {
    return this.app;
  }

  async connectToDatabase() {
    testConnection();
  }

  initializeMiddlewares() {
    //this.app.use(morgan(LOG_FORMAT, { stream }));
    //this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));

    this.app.use(morgan(process.env.NODE_ENV));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
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

const app = new App([new AuthRoutes(), new UserRoutes()]);
app.listen();
