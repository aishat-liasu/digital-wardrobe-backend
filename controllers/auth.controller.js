import AuthService from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AwsError } from "../utils/awsError.js";

class AuthController {
  authService = new AuthService();

  // Signup a new user to Cognito email OTP
  signUp = catchAsync(async (req, res, next) => {
    const { email, firstName, lastName } = req.body;

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
  });

  // Confirm user signup (email verification)
  confirmSignUp = catchAsync(async (req, res, next) => {
    const { email, code } = req.body;
    const response = await this.authService.confirmSignUp({ email, code });

    res.status(200).json({
      message: "User has been verified successfully.",
      data: response,
    });
  });

  // Get user info
  getUserData = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const response = await this.authService.getUserData(email);
    res.status(200).json({ message: "User exists", data: response });
  });

  // Resend OTP for sign up verification
  resendVerificationCode = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const response = await this.authService.resendVerificationCode(email);
    res.json({
      message: "Confirmation code resent. Check your email.",
      data: response,
    });
  });

  // Send email email OTP to login
  login = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const response = await this.authService.login(email);
    res.json({
      message: "Account confirmed. Check your email for OTP",
      session: response?.Session,
    });
  });

  // Verify email OTP
  verifyOtp = catchAsync(async (req, res, next) => {
    const { email, code, session } = req.body;

    const response = await this.authService.verifyOtp({
      email,
      code,
      session,
    });
    res.json({
      message: "Login successful",
      tokens: response.AuthenticationResult,
    });
  });

  refresh = catchAsync(async (req, res, next) => {
    const { email, refreshToken } = req.body;
    const response = await this.authService.refreshToken({
      email,
      refreshToken,
    });
    res.json({
      message: "Refresh successful",
      tokens: response.AuthenticationResult,
    });
  });
}

export default AuthController;
