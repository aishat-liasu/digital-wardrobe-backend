import { logger } from "../utils/logger.js";
import { AwsError } from "../utils/awsError.js";

const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // Transform AWS errors into AppErrors
  if (error.$metadata || error.$response || error.name === "UserNotFoundException" || error.name === "NotAuthorizedException") {
    error = AwsError(error);
  }

  const status = error.status || error.statusCode || 500;
  const message = error.message || "An unexpected error occurred";

  if (status >= 500) {
    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}, Stack:: ${error.stack}`,
    );
  } else {
    logger.warn(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
    );
  }
  const code = error.code || "INTERNAL_ERROR";
  return res.status(status).json({ success: false, message, code });
};

export default errorMiddleware;
