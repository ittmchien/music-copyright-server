const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.requestRefreshToken);
router.post("/logout",  authController.logoutUser);

module.exports = router;
