const { Router } = require("express");
const CartController = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = Router();

router
  .route("/")
  .get(authenticate, CartController.getMyCart)
  .post(authenticate, CartController.addToCart)
  .put(authenticate, CartController.updateCartItem)
  .delete(authenticate, CartController.removeFromCart);

module.exports = router;
