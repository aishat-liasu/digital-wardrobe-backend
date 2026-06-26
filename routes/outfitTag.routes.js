import { Router } from "express";
import OutfitTagController from "../controllers/outfitTag.controller.js";

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
  }
}
