const express = require("express");
const router = express.Router();
const {
  getOperations,
  getOperation,
  createOperation,
  updateOperation,
  validateOperation,
} = require("../controllers/operationController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, getOperations);
router.get("/:id", authMiddleware, getOperation);
router.post("/", authMiddleware, createOperation); // Staff can create drafts
router.put("/:id", authMiddleware, updateOperation);
router.post("/:id/validate", authMiddleware, validateOperation); // Staff can validate

module.exports = router;
