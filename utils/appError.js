export class AppError extends Error {
  constructor(status = 500, message, code = "CLIENT_ERROR") {
    super(message);
    this.status = status;
    this.message = message;
    this.code = code;
  }
}
