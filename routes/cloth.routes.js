import { Router } from "express";
import ClothController from "../controllers/cloth.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class ClothRoutes {
  path = "/api/clothes";
  router = Router();
  clothController = new ClothController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(verifyCognitoToken);
    this.router.get("/stats", this.clothController.getClothStats);
    this.router.get("/", this.clothController.getAllClothes);
    this.router.post("", this.clothController.createCloth);
    this.router.get("/:id", this.clothController.getClothById);
    this.router.put("/:id", this.clothController.updateCloth);
    this.router.delete("/:id", this.clothController.deleteCloth);
  }
}
