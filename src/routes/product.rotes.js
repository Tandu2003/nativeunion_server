const { Router } = require("express");
const ProductController = require("../controllers/product.controller");
const { isAdmin } = require("../middlewares/auth.middleware");

const router = Router();

router
  .route("/")
  .get(ProductController.getAllProducts)
  .post(isAdmin, ProductController.createProduct);
router.get("/:slug", ProductController.getProductBySlug);
router
  .route("/:id")
  .put(isAdmin, ProductController.updateProduct)
  .delete(isAdmin, ProductController.deleteProduct);
router.get("/search/:name", ProductController.searchProductByName);

module.exports = router;
