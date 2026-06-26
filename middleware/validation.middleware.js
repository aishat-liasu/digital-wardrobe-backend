export const validateRequest = (schema, source = "body") => (req, res, next) => {
  try {
    const validatedData = schema.parse(req[source]);
    req[source] = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }
};
