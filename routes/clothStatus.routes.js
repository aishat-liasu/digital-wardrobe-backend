import { Router } from "express";
import ClothStatusController from "../controllers/clothStatus.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class ClothStatusRoutes {
  path = "/api/cloth-statuses";
  router = Router();
  controller = new ClothStatusController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", this.controller.getAll);
    this.router.get("/:id", this.controller.getById);

    // this.router.post("/", verifyCognitoToken, this.controller.create);
    // this.router.delete("/:id", verifyCognitoToken, this.controller.delete);
  }
}
