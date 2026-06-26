import { Router } from "express";
import OutfitOccasionController from "../controllers/outfitOccasion.controller.js";

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


  }
}
