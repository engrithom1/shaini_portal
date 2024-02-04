const express = require('express')
const router = express.Router();

const mainController = require("../controllers/mainController");
const authController = require("../controllers/authController");
const checker = require("../middleware/authMiddleware");

///Page Routes
router.get("/", mainController.home);
router.get("/about", mainController.about);

///Auth routers
router.get("/login",checker.sessionChecker, authController.loginForm);
router.get("/register",checker.sessionChecker, authController.registerForm);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

module.exports = router; 