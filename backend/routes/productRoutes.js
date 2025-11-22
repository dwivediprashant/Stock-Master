const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getUnits,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.route("/").get(authMiddleware, getProducts).post(authMiddleware, createProduct);
router.get("/categories", authMiddleware, getCategories);
router.get("/units", authMiddleware, getUnits);
router
  .route("/:id")
  .get(authMiddleware, getProduct)
  .put(authMiddleware, updateProduct)
  .delete(authMiddleware, deleteProduct);

module.exports = router;
