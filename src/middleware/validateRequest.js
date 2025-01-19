const { ZodError } = require("zod");

const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: "error",
        errors: error.errors.map((err) => ({
          field: err.path[1],
          message: err.message,
        })),
      });
    }
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

module.exports = validateRequest;
