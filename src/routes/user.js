//creating routes in route.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { signupSchema, loginSchema } = require("../schemas/userSchema");
const validateRequest = require("../middleware/validateRequest");
const authMiddleware = require("../middleware/auth");

router.post("/signup", validateRequest(signupSchema), userController.signup);
router.post("/login", validateRequest(loginSchema), userController.login);
router.post("/logout", authMiddleware, userController.logout);

//delete user
router.delete("/delete", authMiddleware, userController.deleteUser);

//get user profile data
router.get("/profile", authMiddleware, userController.profile);

router.patch("/update/:userId", authMiddleware, userController.updateUser);

//get all user from db
router.get("/all", userController.getAllUsers);
// router.get('/profile', userController.profile);
// router.get

module.exports = router;
