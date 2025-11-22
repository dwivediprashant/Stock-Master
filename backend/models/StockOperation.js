const mongoose = require("mongoose");

const stockOperationSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["receipt", "delivery", "internal", "adjustment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "waiting", "ready", "done", "canceled"],
      default: "draft",
    },
    partner: {
      type: String, // Supplier or Customer Name
      trim: true,
    },
    sourceLocation: {
      type: String,
      default: "Vendor", // Default for receipts
    },
    destinationLocation: {
      type: String,
      default: "WH/Stock", // Default for receipts
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        doneQuantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StockOperation", stockOperationSchema);
