import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

export const confirmSignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  code: z.coerce.string().regex(/^\d+$/, "Verification code must contain only numbers").min(1, { message: "Verification code is required" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const verifyOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  code: z.coerce.string().regex(/^\d+$/, "OTP code must contain only numbers").min(1, { message: "OTP code is required" }),
  session: z.string().min(1, { message: "Session token is required" }),
});

export const refreshSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  refreshToken: z.string().min(1, { message: "Refresh token is required" }),
});

export const resendCodeSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
