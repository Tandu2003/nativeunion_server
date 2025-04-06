const { Router } = require("express");
const { isAdmin } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", ProductController.getAllProducts);
router.get("/:slug", ProductController.getProductBySlug);
router.post("/", isAdmin, ProductController.createProduct);
router.put("/:id", isAdmin, ProductController.updateProduct);
router.delete("/:id", isAdmin, ProductController.deleteProduct);

module.exports = router;
