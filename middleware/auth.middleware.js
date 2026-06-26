import { CognitoJwtVerifier } from "aws-jwt-verify";
import UserService from "../services/user.service.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Create a verifier instance (for Access Tokens)
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID,
  tokenUse: "access",
});

const userService = new UserService();

const verifyCognitoToken = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Access token missing", "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = await verifier.verify(token);
  } catch (err) {
    throw new AppError(401, "Invalid or expired token", "UNAUTHORIZED");
  }

  const user = await userService.getUserByCognitoId(payload?.sub);
  if (!user) throw new AppError(404, "Cognito user doesn't exist", "USER_NOT_FOUND");

  // Attach user details to request
  req.user = {
    sub: payload.sub,
    username: payload["username"] || payload["cognito:username"],
    cognitoId: payload.sub,
    expireTime: payload.exp,
    id: user.id,
  };

  next();
});

export default verifyCognitoToken;
