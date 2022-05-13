const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = require("express").Router();


router.get(
  "/profile/:id",
  authMiddleware.verifyToken,
  userController.getUserProfile
);

router.put(
  "/profile/update/:id",
  authMiddleware.verifyToken,
  userController.updateUserProfile
);

module.exports = router;
