const express = require("express");
const router = express.Router();

const requestController = require("../controllers/request.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  sendRequestSchema,
  reviewRequestSchema,
} = require("../schemas/requestSchema");
const validateRequest = require("../middleware/validateRequest");

router.use(authMiddleware);

router.post(
  "/send/:status/:userId",
  validateRequest(sendRequestSchema),
  requestController.createRequest
);

router.patch(
  "/review/:status/:requestId",
  validateRequest(reviewRequestSchema),
  requestController.updateRequest
);

router.get("/getAll", requestController.getAllRequest);

module.exports = router;
