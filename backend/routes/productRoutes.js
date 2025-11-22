// backend/routes/productRoutes.js
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

// All product endpoints require authentication (staff & manager allowed)
router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, createProduct);
router.get("/categories", authMiddleware, getCategories);
router.get("/units", authMiddleware, getUnits);
router.get("/:id", authMiddleware, getProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
