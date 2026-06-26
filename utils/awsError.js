import { AppError } from "./appError.js";
import { logger } from "./logger.js";

const awsToHttpMap = {
  UserNotFoundException: {
    status: 404,
    code: "USER_NOT_FOUND",
    message: "User not found",
  },
  NotAuthorizedException: {
    status: 401,
    code: "NOT_AUTHORIZED",
    message: "Invalid credentials",
  },
  UsernameExistsException: {
    status: 400,
    code: "USERNAME_EXISTS",
    message: "User already exists",
  },
  CodeMismatchException: {
    status: 400,
    code: "INVALID_CONFIRMATION_CODE",
    message: "Invalid confirmation code",
  },
  ExpiredCodeException: {
    status: 400,
    code: "CONFIRMATION_CODE_EXPIRED",
    message: "Confirmation code expired",
  },
  InvalidParameterException: {
    status: 400,
    code: "INVALID_PARAMETER",
    message: "Invalid parameter",
  },
  TooManyRequestsException: {
    status: 429,
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests, please try again later",
  },
  InternalErrorException: {
    status: 502,
    code: "CLOUD_SERVICE_ERROR",
    message: "Upstream service error",
  },
};

/**
 * Translate AWS SDK error to AppError
 * Logs full error via provided logger before returning AppError
 */
export function AwsError(err) {
  const name =
    err?.$response?.headers["x-amzn-errortype"] || err?.code || "UnknownError";
  const httpCode = err?.$response?.statusCode || err?.status || 500;
  const errorMessage =
    err?.$response?.headers["x-amzn-errormessage"] ||
    err?.message ||
    "An error occurred while processing your request.";

  console.log(err?.__type);
  console.log(name, httpCode, errorMessage);

  logger.error("AWS error:", {
    name,
    message: err?.message,
    httpCode,
    stack: err?.stack,
  });

  if (awsToHttpMap[name]) {
    const mapping = awsToHttpMap[name];

    return new AppError(mapping.status, mapping.message, mapping.code, {
      awsMessage: errorMessage,
    });
  }

  // Network / retryable error detection
  const isRetryable = !!err?.retryable || (httpCode && httpCode >= 500);

  if (isRetryable) {
    return new AppError(
      502,
      "Temporary service error. Please try again later.",
      "TEMPORARY_SERVICE_ERROR",
      { awsMessage: errorMessage }
    );
  }

  // Unknown error
  const statusCode =
    httpCode && httpCode >= 400 && httpCode < 500 ? httpCode : 500;
  return new AppError(statusCode, errorMessage, name);
}
