const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const profileController = require("../controllers/profile.controller");

router.use(authMiddleware);

router.get("/view", profileController.profileView);
router.patch("/edit", profileController.profileEdit);
router.patch("/password", profileController.changePassword);

module.exports = router;
