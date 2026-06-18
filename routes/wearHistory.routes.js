import { Router } from "express";
import WearHistoryController from "../controllers/wearHistory.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class WearHistoryRoutes {
  path = "/api/wear-history";
  router = Router();
  controller = new WearHistoryController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(verifyCognitoToken);
    this.router.get("/stats", this.controller.getWearHistoryStats);
    this.router.get("/", this.controller.getAllWearHistory);
    this.router.post("/", this.controller.createWearHistory);
    this.router.get("/:id", this.controller.getWearHistoryById);
    this.router.put("/:id", this.controller.updateWearHistory);
    this.router.delete("/:id", this.controller.deleteWearHistory);
  }
}
