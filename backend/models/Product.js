const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    unitOfMeasure: {
      type: String,
      required: true,
      trim: true, // e.g., 'kg', 'pcs', 'liters'
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    minStockLevel: {
      type: Number,
      default: 0,
    },
    // Current stock is derived from moves, but we can cache it here for performance
    // Ideally, this should be updated transactionally with stock moves.
    currentStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
