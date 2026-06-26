import { Router } from "express";
import ClothController from "../controllers/cloth.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { createClothSchema, updateClothSchema } from "../validations/cloth.validation.js";
import { paginationQuerySchema } from "../validations/query.validation.js";

export default class ClothRoutes {
  path = "/api/clothes";
  router = Router();
  clothController = new ClothController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(verifyCognitoToken);
    this.router.get(
      "/", 
      validateRequest(paginationQuerySchema, "query"), 
      this.clothController.getAllClothes
    );

    this.router.post(
      "/",
      validateRequest(createClothSchema),
      this.clothController.createCloth
    );

    this.router.get("/:id", this.clothController.getClothById);

    this.router.put(
      "/:id",
      validateRequest(updateClothSchema),
      this.clothController.updateCloth
    );

    this.router.delete("/:id", this.clothController.deleteCloth);
  }
}
