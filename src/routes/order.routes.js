const { Router } = require("express");
const OrderController = require("../controllers/order.controller");
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/", authenticate, OrderController.createOrder);
router.get("/mine", authenticate, OrderController.getMyOrders);
router.get("/all", authenticate, isAdmin, OrderController.getAllOrders);
router.get("/:id", authenticate, OrderController.getOrderById);
router.put("/:id/status", authenticate, isAdmin, OrderController.updateOrderStatus);
router.put("/:id/cancel", authenticate, OrderController.cancelOrder);

module.exports = router;
