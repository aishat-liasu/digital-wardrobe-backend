import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  signUpSchema,
  confirmSignUpSchema,
  loginSchema,
  verifyOtpSchema,
  refreshSchema,
  resendCodeSchema,
} from "../validations/auth.validation.js";

export default class AuthRoutes {
  path = "/api/auth";
  router = Router();
  authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(authLimiter);

    this.router.post(
      "/refresh",
      validateRequest(refreshSchema),
      this.authController.refresh
    );
    this.router.post(
      "/signup",
      validateRequest(signUpSchema),
      this.authController.signUp
    );
    this.router.post(
      "/confirm-signup",
      validateRequest(confirmSignUpSchema),
      this.authController.confirmSignUp
    );
    this.router.post(
      "/verify-otp",
      validateRequest(verifyOtpSchema),
      this.authController.verifyOtp
    );
    this.router.post(
      "/login",
      validateRequest(loginSchema),
      this.authController.login
    );
    this.router.get(
      "/resend-code",
      validateRequest(resendCodeSchema),
      this.authController.resendVerificationCode
    );
    this.router.get("/user", this.authController.getUserData);
  }
}
