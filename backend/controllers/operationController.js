// backend/controllers/operationController.js
const StockOperation = require("../models/StockOperation");
const StockMove = require("../models/StockMove");
const Product = require("../models/Product");

// ---------------------------------------------------------------
// Get all operations (optionally filtered by type)
// ---------------------------------------------------------------
async function getOperations(req, res) {
  const { type } = req.query;
  const filter = type ? { type } : {};
  try {
    const operations = await StockOperation.find(filter)
      .populate("items.product", "name sku")
      .sort({ createdAt: -1 });
    res.json(operations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ---------------------------------------------------------------
// Get a single operation by ID
// ---------------------------------------------------------------
async function getOperation(req, res) {
  try {
    const operation = await StockOperation.findById(req.params.id).populate(
      "items.product",
      "name sku unitOfMeasure"
    );
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    res.json(operation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ---------------------------------------------------------------
// Create a new operation (receipt, delivery, internal, adjustment)
// ---------------------------------------------------------------
async function createOperation(req, res) {
  const { type, partner, items } = req.body;
  try {
    // Basic validation – ensure required fields exist
    if (!type || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "type and at least one item are required" });
    }

    // Partner is required for receipt and delivery
    if ((type === "receipt" || type === "delivery") && !partner) {
      return res.status(400).json({ message: "partner is required for this operation type" });
    }

    const operation = await StockOperation.create({
      type,
      partner,
      status: "draft",
      items: items.map((it) => ({
        product: it.product,
        quantity: it.quantity,
        doneQuantity: 0,
      })),
    });
    res.status(201).json(operation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ---------------------------------------------------------------
// Update an existing operation – only allowed while status is "draft"
// ---------------------------------------------------------------
async function updateOperation(req, res) {
  try {
    const operation = await StockOperation.findById(req.params.id);
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    if (operation.status !== "draft") {
      return res
        .status(400)
        .json({ message: "Cannot edit non‑draft operations" });
    }
    const { partner, items } = req.body;
    if (partner) operation.partner = partner;
    if (items) operation.items = items;
    const updated = await operation.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// ---------------------------------------------------------------
// Validate (process) an operation – updates stock & creates ledger moves
// ---------------------------------------------------------------
async function validateOperation(req, res) {
  try {
    const operation = await StockOperation.findById(req.params.id).populate(
      "items.product"
    );
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    if (operation.status === "done") {
      return res
        .status(400)
        .json({ message: "Operation already validated" });
    }

    // ----- receipt ------------------------------------------------
    if (operation.type === "receipt") {
      for (const item of operation.items) {
        const product = await Product.findById(item.product._id);
        const newStock = product.currentStock + item.quantity;
        product.currentStock = newStock;
        await product.save();
        await StockMove.create({
          product: item.product._id,
          description: `Receipt ${operation.reference}`,
          reference: operation.reference,
          quantity: item.quantity,
          locationFrom: operation.sourceLocation,
          locationTo: operation.destinationLocation,
          balanceAfter: newStock,
        });
        item.doneQuantity = item.quantity;
      }
    }
    // ----- delivery -----------------------------------------------
    else if (operation.type === "delivery") {
      for (const item of operation.items) {
        const product = await Product.findById(item.product._id);
        if (product.currentStock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${item.quantity}`
          );
        }
        const newStock = product.currentStock - item.quantity;
        product.currentStock = newStock;
        await product.save();
        await StockMove.create({
          product: item.product._id,
          description: `Delivery ${operation.reference}`,
          reference: operation.reference,
          quantity: -item.quantity,
          locationFrom: operation.sourceLocation || "WH/Stock",
          locationTo: operation.destinationLocation || "Customer",
          balanceAfter: newStock,
        });
        item.doneQuantity = item.quantity;
      }
    }
    // ----- internal transfer --------------------------------------
    else if (operation.type === "internal") {
      for (const item of operation.items) {
        const product = await Product.findById(item.product._id);
        if (product.currentStock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name} to transfer.`
          );
        }
        await StockMove.create({
          product: item.product._id,
          description: `Internal Transfer ${operation.reference}`,
          reference: operation.reference,
          quantity: item.quantity,
          locationFrom: operation.sourceLocation || "WH/Stock",
          locationTo: operation.destinationLocation || "WH/Production",
          balanceAfter: product.currentStock,
        });
        item.doneQuantity = item.quantity;
      }
    }
    // ----- adjustment --------------------------------------------
    else if (operation.type === "adjustment") {
      for (const item of operation.items) {
        const product = await Product.findById(item.product._id);
        const newStock = product.currentStock + item.quantity; // quantity may be negative
        product.currentStock = newStock;
        await product.save();
        await StockMove.create({
          product: item.product._id,
          description: `Adjustment ${operation.reference}`,
          reference: operation.reference,
          quantity: item.quantity,
          locationFrom: item.quantity >= 0 ? "Virtual/Adjustment" : "WH/Stock",
          locationTo: item.quantity >= 0 ? "WH/Stock" : "Virtual/Adjustment",
          balanceAfter: newStock,
        });
        item.doneQuantity = item.quantity;
      }
    }

    operation.status = "done";
    await operation.save();
    res.json(operation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getOperations,
  getOperation,
  createOperation,
  updateOperation,
  validateOperation,
};
