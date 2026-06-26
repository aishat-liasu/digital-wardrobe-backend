import { Router } from "express";
import OutfitController from "../controllers/outfit.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { createOutfitSchema, updateOutfitSchema } from "../validations/outfit.validation.js";
import { paginationQuerySchema } from "../validations/query.validation.js";

export default class OutfitRoutes {
  path = "/api/outfits";
  router = Router();
  controller = new OutfitController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(verifyCognitoToken);
    this.router.get("/random", this.controller.getRandomOutfit);
    this.router.get(
      "/", 
      validateRequest(paginationQuerySchema, "query"), 
      this.controller.getAllOutfits
    );

    this.router.post(
      "/",
      validateRequest(createOutfitSchema),
      this.controller.createOutfit
    );

    this.router.get("/:id", this.controller.getOutfitById);

    this.router.put(
      "/:id",
      validateRequest(updateOutfitSchema),
      this.controller.updateOutfit
    );

    this.router.delete("/:id", this.controller.deleteOutfit);
  }
}
