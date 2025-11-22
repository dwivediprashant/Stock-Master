const mongoose = require("mongoose");

const stockMoveSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reference: {
      type: String, // Link to Operation Reference e.g. WH/IN/001
    },
    quantity: {
      type: Number,
      required: true, // Positive for add, Negative for remove
    },
    locationFrom: {
      type: String,
    },
    locationTo: {
      type: String,
    },
    balanceAfter: {
      type: Number, // Snapshot of stock after move
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StockMove", stockMoveSchema);
