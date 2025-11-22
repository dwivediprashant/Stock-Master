const Product = require("../models/Product");
const StockMove = require("../models/StockMove");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Products
    const totalProducts = await Product.countDocuments();

    // 2. Total Stock Value (Sum of currentStock * price)
    // Note: We need to ensure price and currentStock are numbers.
    const stockValueAggregation = await Product.aggregate([
      {
        $project: {
          value: { $multiply: ["$price", "$currentStock"] },
        },
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$value" },
        },
      },
    ]);
    const totalValue = stockValueAggregation.length > 0 ? stockValueAggregation[0].totalValue : 0;

    // 3. Low Stock Alerts
    // Find products where currentStock <= minStockLevel
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ["$currentStock", "$minStockLevel"] },
    });

    // 4. Recent Activity (Last 5 Stock Moves)
    const recentActivity = await StockMove.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("product", "name");

    res.json({
      totalProducts,
      totalValue,
      lowStockCount,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
