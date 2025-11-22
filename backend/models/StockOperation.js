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
    scheduleDate: {
      type: Date,
      default: Date.now,
    },
    responsible: {
      type: String,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
    availableDate: {
      type: Date,
    },
    destinationType: {
      type: String,
      enum: ["customer", "warehouse", "other"],
      default: "customer",
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

// Auto-generate reference before saving
stockOperationSchema.pre('save', async function(next) {
  if (!this.isNew || this.reference) {
    return next();
  }

  try {
    // Get prefix based on type
    let prefix = 'WH/';
    switch(this.type) {
      case 'receipt':
        prefix += 'IN/';
        break;
      case 'delivery':
        prefix += 'OUT/';
        break;
      case 'internal':
        prefix += 'INT/';
        break;
      case 'adjustment':
        prefix += 'ADJ/';
        break;
      default:
        prefix += 'OP/';
    }

    // Find the last operation of this type
    const lastOp = await this.constructor.findOne({ 
      type: this.type 
    }).sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastOp && lastOp.reference) {
      // Extract number from reference (e.g., "WH/IN/0005" -> 5)
      const match = lastOp.reference.match(/\/(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Generate reference with zero-padding
    this.reference = `${prefix}${String(nextNumber).padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("StockOperation", stockOperationSchema);
