import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class DashboardRoutes {
  path = "/api/dashboard";
  router = Router();
  dashboardController = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(verifyCognitoToken);
    this.router.get("/", this.dashboardController.getDashboardData);
  }
}
