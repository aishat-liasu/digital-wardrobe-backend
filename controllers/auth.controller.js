import AuthService from "../services/auth.service.js";
import { AwsError } from "../utils/awsError.js";

class AuthController {
  authService = new AuthService();

  // Signup a new user to Cognito email OTP
  // TODO: DATA VALIDATION
  signUp = async (req, res) => {
    const { email, firstName, lastName } = req.body;
    console.log("=== REQ.BODY ===\n", req.body);

    console.log("This in AuthController", this);

    try {
      const response = await this.authService.signUp({
        email,
        firstName,
        lastName,
      });

      res.status(201).json({
        message: "Account created. Check your email to confirm.",
        success: true,
        data: response,
      });
    } catch (error) {
      const newError = AwsError(error);
      next(newError);
    }
  };

  // Confirm user signup (email verification)
  confirmSignUp = async (req, res, next) => {
    const { email, code } = req.body;
    console.log("=== REQ.BODY IN CONTROLLER ===\n", req.body);
    try {
      const response = await this.authService.confirmSignUp({ email, code });

      res.status(200).json({
        message: "User has been verified successfully.",
        data: response,
      });
    } catch (error) {
      const newError = AwsError(error);
      next(newError);
    }
  };

  // Get user info
  getUserData = async (req, res, next) => {
    const { email } = req.body;

    try {
      const response = await this.authService.getUserData(email);

      res.status(200).json({ message: "User exits", data: response });
    } catch (error) {
      const newError = AwsError(error);
      next(newError);
    }
  };

  // Resend OTP for sign up verification
  resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
      const response = await this.authService.resendVerificationCode(email);
      res.json({
        message: "Confirmation code resent. Check your email.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Send email email OTP to login
  login = async (req, res) => {
    const { email } = req.body;
    try {
      const response = await this.authService.login(email);
      res.json({
        message: "Account confirmed. Check your email for OTP",
        session: response?.Session,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Verify email OTP
  verifyOtp = async (req, res) => {
    const { email, code, session } = req.body;

    try {
      const response = await this.authService.verifyOtp({
        email,
        code,
        session,
      });
      res.json({
        message: "Login successful",
        tokens: response.AuthenticationResult,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };
}

export default AuthController;
