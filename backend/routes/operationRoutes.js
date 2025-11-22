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

router.route("/").get(authMiddleware, getOperations).post(authMiddleware, createOperation);
router.route("/:id").get(authMiddleware, getOperation).put(authMiddleware, updateOperation);
router.post("/:id/validate", authMiddleware, validateOperation);

module.exports = router;
