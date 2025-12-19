import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

export default class AuthRoutes {
  path = "/api/auth";
  router = Router();
  authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.signUp);
    this.router.post(
      `${this.path}/confirm-signup`,
      this.authController.confirmSignUp
    );
    this.router.post(`${this.path}/verify-otp`, this.authController.verifyOtp);
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.get(
      `${this.path}/resend-code`,
      this.authController.resendVerificationCode
    );
    this.router.get(`${this.path}/user`, this.authController.getUserData);
  }
}
