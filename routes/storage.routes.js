import { Router } from "express";
import StorageController from "../controllers/storage.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { presignedUrlSchema } from "../validations/storage.validation.js";
export default class StorageRoutes {
  path = "/api/upload";
  router = Router();
  storageController = new StorageController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(verifyCognitoToken);

    this.router.post(
      "/presigned",
      validateRequest(presignedUrlSchema),
      this.storageController.getPresignedUrl,
    );
  }
}
