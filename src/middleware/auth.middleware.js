const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const authMiddleware = (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = authMiddleware;
