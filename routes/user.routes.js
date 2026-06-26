import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import verifyCognitoToken from "../middleware/auth.middleware.js";

export default class UserRoutes {
  path = "/api/users";
  router = Router();
  userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", this.userController.createUser);

    this.router.use(verifyCognitoToken);

    this.router.get(
      "/cognito/:cognitoId",
      this.userController.getUserByCognitoId,
    );

    this.router.get("/", (req, res, next) => {
      if (req.query.email) {
        return this.userController.getUserByEmail(req, res, next);
      }
      return this.userController.getUser(req, res, next);
    });

    this.router
      .route("/:id")
      .get(this.userController.getUserById)
      .patch(this.userController.updateUser)
      .delete(this.userController.deleteUser);
  }
}
