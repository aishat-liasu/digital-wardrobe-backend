import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class UserRoutes {
  path = "/api";
  router = Router();
  userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Private routes
    this.router.get(
      `${this.path}/user/:id`,
      verifyCognitoToken,
      this.userController.getUserById
    );
    this.router.get(
      `${this.path}/users/cognito/:cognitoId`,
      verifyCognitoToken,
      this.userController.getUserByCognitoId
    );
    this.router.put(
      `${this.path}/user/:id`,
      verifyCognitoToken,
      this.userController.updateUser
    );
    this.router.delete(
      `${this.path}/user/:id`,
      verifyCognitoToken,
      this.userController.deleteUser
    );

    // Public route
    this.router.get(`${this.path}/users`, this.userController.getUsers);
    this.router.post(`${this.path}/users`, this.userController.createUser);
  }
}
