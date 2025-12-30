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
    // Public Routes
    this.router.post("/", this.userController.createUser);
    this.router.get("/all", this.userController.getUsers);

    // Apply middleware to all routes below this line
    this.router.use(verifyCognitoToken);

    // Get User by Cognito ID
    this.router.get(
      "/cognito/:cognitoId",
      this.userController.getUserByCognitoId
    );

    // Root Path
    this.router.get("/", (req, res, next) => {
      if (req.query.email) {
        return this.userController.getUserByEmail(req, res, next);
      }
      return this.userController.getUser(req, res, next);
    });

    // ID Path
    this.router
      .route("/:id")
      .get(this.userController.getUserById)
      .put(this.userController.updateUser)
      .delete(this.userController.deleteUser);
  }
}
