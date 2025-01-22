//creating routes in route.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { signupSchema, loginSchema } = require("../schemas/userSchema");
const validateRequest = require("../middleware/validateRequest");

router.post("/signup", validateRequest(signupSchema), userController.signup);
router.post("/login", validateRequest(loginSchema), userController.login);
router.post("/logout", userController.logout);

//delete user
router.delete("/delete", userController.deleteUser);

router.patch("/update/:userId", userController.updateUser);

//get all user from db
router.get("/all", userController.getAllUsers);
// router.get('/profile', userController.profile);
// router.get

module.exports = router;
