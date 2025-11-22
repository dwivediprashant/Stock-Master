const StockMove = require("../models/StockMove");

// @desc    Get all stock moves (Ledger)
// @route   GET /api/moves
// @access  Private
const getStockMoves = async (req, res) => {
  try {
    const moves = await StockMove.find()
      .populate("product", "name sku unitOfMeasure")
      .sort({ createdAt: -1 });
    res.json(moves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStockMoves,
};
