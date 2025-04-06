const { Router } = require("express");
const UserController = require("../controllers/user.controller");
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");

const router = Router();

router
  .get("/me", authenticate, UserController.getMe)
  .put("/me", authenticate, UserController.updateMe);
router.post("/me/change-password", authenticate, UserController.changePassword);

router.get("/", authenticate, isAdmin, UserController.getAllUsers);
router
  .put("/:id", authenticate, isAdmin, UserController.updateUser)
  .delete("/:id", authenticate, isAdmin, UserController.deleteUser);

module.exports = router;
