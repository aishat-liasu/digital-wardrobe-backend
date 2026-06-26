import { Router } from "express";
import ClothTypeController from "../controllers/clothType.controller.js";

export default class ClothTypeRoutes {
  path = "/api/cloth-types";
  router = Router();
  controller = new ClothTypeController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", this.controller.getAll);
    this.router.get("/:id", this.controller.getById);

  }
}
