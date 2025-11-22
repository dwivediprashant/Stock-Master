const express = require("express");
const router = express.Router();

const {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");

// Import auth middleware correctly
const authenticate = require("../middleware/authMiddleware");

// Apply authentication to all routes
router.use(authenticate);

// Define CRUD routes
router.get("/", getWarehouses);
router.get("/:id", getWarehouse);
router.post("/", createWarehouse);
router.put("/:id", updateWarehouse);
router.delete("/:id", deleteWarehouse);

module.exports = router;
