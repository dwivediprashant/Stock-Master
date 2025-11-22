const StockOperation = require("../models/StockOperation");
const StockMove = require("../models/StockMove");
const Product = require("../models/Product");

// @desc    Get all operations (filtered by type)
// @route   GET /api/operations?type=receipt
// @access  Private
const getOperations = async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  try {
    const operations = await StockOperation.find(filter)
      .populate("items.product", "name sku")
      .sort({ createdAt: -1 });
    res.json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single operation
// @route   GET /api/operations/:id
// @access  Private
const getOperation = async (req, res) => {
  try {
    const operation = await StockOperation.findById(req.params.id).populate(
      "items.product",
      "name sku unitOfMeasure"
    );
    if (operation) {
      res.json(operation);
    } else {
      res.status(404).json({ message: "Operation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new operation (Receipt)
// @route   POST /api/operations
// @access  Private
const createOperation = async (req, res) => {
  const { type, partner, items } = req.body;

  try {
    // Simple reference generation: TYPE-TIMESTAMP (e.g., IN-1715000000)
    let prefix = "WH/OPS";
    if (type === "receipt") prefix = "WH/IN";
    else if (type === "delivery") prefix = "WH/OUT";
    
    const reference = `${prefix}/${Date.now().toString().slice(-6)}`;

    const operation = await StockOperation.create({
      reference,
      type,
      partner,
      status: "draft",
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        doneQuantity: 0,
      })),
    });

    res.status(201).json(operation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update operation (only if draft)
// @route   PUT /api/operations/:id
// @access  Private
const updateOperation = async (req, res) => {
  try {
    const operation = await StockOperation.findById(req.params.id);

    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }

    if (operation.status !== "draft") {
      return res.status(400).json({ message: "Cannot edit non-draft operations" });
    }

    const { partner, items } = req.body;
    operation.partner = partner || operation.partner;
    if (items) {
      operation.items = items;
    }

    const updatedOperation = await operation.save();
    res.json(updatedOperation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Validate operation (Process Stock)
// @route   POST /api/operations/:id/validate
// @access  Private
const validateOperation = async (req, res) => {
  try {
    const operation = await StockOperation.findById(req.params.id).populate("items.product");

    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }

    if (operation.status === "done") {
      return res.status(400).json({ message: "Operation already validated" });
    }

    // Process based on type
    if (operation.type === "receipt") {
      for (const item of operation.items) {
        // 1. Update Product Stock
        const product = await Product.findById(item.product._id);
        const oldStock = product.currentStock;
        const newStock = oldStock + item.quantity;
        
        product.currentStock = newStock;
        await product.save();

        // 2. Create Stock Move (Ledger)
        await StockMove.create({
          product: item.product._id,
          description: `Receipt ${operation.reference}`,
          reference: operation.reference,
          quantity: item.quantity,
          locationFrom: operation.sourceLocation,
          locationTo: operation.destinationLocation,
          balanceAfter: newStock,
        });

        // 3. Update Done Quantity on Operation
        item.doneQuantity = item.quantity;
      }
    } else if (operation.type === "delivery") {
      for (const item of operation.items) {
        // 1. Check and Update Product Stock
        const product = await Product.findById(item.product._id);
        
        if (product.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.currentStock}, Requested: ${item.quantity}`);
        }

        const oldStock = product.currentStock;
        const newStock = oldStock - item.quantity;
        
        product.currentStock = newStock;
        await product.save();

        // 2. Create Stock Move (Ledger)
        await StockMove.create({
          product: item.product._id,
          description: `Delivery ${operation.reference}`,
          reference: operation.reference,
          quantity: -item.quantity, // Negative for outgoing
          locationFrom: operation.sourceLocation || "WH/Stock",
          locationTo: operation.destinationLocation || "Customer",
          balanceAfter: newStock,
        });

        // 3. Update Done Quantity
        item.doneQuantity = item.quantity;
      }
    }


    operation.status = "done";
    await operation.save();

    res.json(operation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOperations,
  getOperation,
  createOperation,
  updateOperation,
  validateOperation,
};
