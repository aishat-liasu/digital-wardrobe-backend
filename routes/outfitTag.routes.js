import { Router } from "express";
import OutfitTagController from "../controllers/outfitTag.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class OutfitTagRoutes {
  path = "/api/outfit-tags";
  router = Router();
  controller = new OutfitTagController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", this.controller.getAll);
    this.router.get("/:id", this.controller.getById);

    // this.router.post("/", verifyCognitoToken, this.controller.create);
    // this.router.put("/:id", verifyCognitoToken, this.controller.update);
    // this.router.delete("/:id", verifyCognitoToken, this.controller.delete);
  }
}
