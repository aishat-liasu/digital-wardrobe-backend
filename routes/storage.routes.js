import { Router } from "express";
import StorageController from "../controllers/storage.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class StorageRoutes {
  path = "/api/upload";
  router = Router();
  storageController = new StorageController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/presigned",
      verifyCognitoToken,
      this.storageController.getPresignedUrl
    );
  }
}
