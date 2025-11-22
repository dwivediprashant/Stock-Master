const express = require("express");
const router = express.Router();
const { getStockMoves } = require("../controllers/stockMoveController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getStockMoves);

module.exports = router;
