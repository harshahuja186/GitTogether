const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

//get all the pending connection request for the logged in user
router.get("/requests", userController.getAllRequests);
router.get("/connections", userController.getAllConnections);

router.get("/feed", userController.getFeed);

module.exports = router;
