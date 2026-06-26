import { Router } from "express";
import WearHistoryController from "../controllers/wearHistory.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { createWearHistorySchema, updateWearHistorySchema } from "../validations/wearHistory.validation.js";
import { paginationQuerySchema } from "../validations/query.validation.js";

export default class WearHistoryRoutes {
  path = "/api/wear-history";
  router = Router();
  controller = new WearHistoryController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(verifyCognitoToken);
    this.router.get(
      "/", 
      validateRequest(paginationQuerySchema, "query"), 
      this.controller.getAllWearHistory
    );

    this.router.post(
      "/",
      validateRequest(createWearHistorySchema),
      this.controller.createWearHistory
    );

    this.router.get("/:id", this.controller.getWearHistoryById);

    this.router.put(
      "/:id",
      validateRequest(updateWearHistorySchema),
      this.controller.updateWearHistory
    );

    this.router.delete("/:id", this.controller.deleteWearHistory);
  }
}
