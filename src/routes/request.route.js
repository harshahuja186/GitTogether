const express = require("express");
const router = express.Router();

const requestController = require("../controllers/request.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { sendRequestSchema } = require("../schemas/requestSchema");
const validateRequest = require("../middleware/validateRequest");

router.use(authMiddleware);
// router.use();

router.post(
  "/send/:status/:userId",
  validateRequest(sendRequestSchema),
  requestController.createRequest
);

module.exports = router;
