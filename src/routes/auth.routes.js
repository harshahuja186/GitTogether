//creating routes in route.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth.controller");
const { signupSchema, loginSchema } = require("../schemas/userSchema");
const validateRequest = require("../middleware/validateRequest");

router.post("/signup", validateRequest(signupSchema), userController.signup);
router.post("/login", validateRequest(loginSchema), userController.login);
router.post("/logout", userController.logout);

module.exports = router;
