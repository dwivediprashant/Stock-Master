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
const checkRole = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, checkRole(["manager"]), createProduct);
router.get("/categories", authMiddleware, getCategories);
router.get("/units", authMiddleware, getUnits);
router.get("/:id", authMiddleware, getProduct);
router.put("/:id", authMiddleware, checkRole(["manager"]), updateProduct);
router.delete("/:id", authMiddleware, checkRole(["manager"]), deleteProduct);

module.exports = router;
