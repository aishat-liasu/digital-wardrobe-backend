import { Router } from "express";
import OutfitController from "../controllers/outfit.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class OutfitRoutes {
  path = "/api/outfits";
  router = Router();
  controller = new OutfitController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(verifyCognitoToken);
    this.router.get("/stats", this.controller.getOutfitStats);
    this.router.get("/", this.controller.getAllOutfits);
    this.router.post("/", this.controller.createOutfit);
    this.router.get("/:id", this.controller.getOutfitById);
    this.router.put("/:id", this.controller.updateOutfit);
    this.router.delete("/:id", this.controller.deleteOutfit);
  }
}
