import { Router } from "express";
import OutfitOccasionController from "../controllers/outfitOccasion.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class OutfitOccasionRoutes {
  path = "/api/outfit-occasions";
  router = Router();
  controller = new OutfitOccasionController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("", this.controller.getAll);
    this.router.get("/:id", this.controller.getById);

    // this.router.post("/", verifyCognitoToken, this.controller.create);
    // this.router.put("/:id", verifyCognitoToken, this.controller.update);
    // this.router.delete("/:id", verifyCognitoToken, this.controller.delete);
  }
}
