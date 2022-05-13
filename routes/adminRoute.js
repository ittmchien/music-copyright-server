const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const router = require("express").Router();

router.get(
  "/users",
  authMiddleware.verifyTokenAdmin,
  adminController.getAllUser
);

router
  .route("/users/:id")
  .put(authMiddleware.verifyTokenAdmin, adminController.updateUser)
  .delete(authMiddleware.verifyTokenAdmin, adminController.deleteUser);

module.exports = router;
