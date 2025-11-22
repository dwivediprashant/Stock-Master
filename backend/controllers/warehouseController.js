const Warehouse = require("../models/Warehouse");

// Get all warehouses
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    res.json(warehouses);
  } catch (error) {
    console.error("Get warehouses error", error);
    res.status(500).json({ message: "Failed to fetch warehouses" });
  }
};

// Get single warehouse
exports.getWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    res.json(warehouse);
  } catch (error) {
    console.error("Get warehouse error", error);
    res.status(500).json({ message: "Failed to fetch warehouse" });
  }
};

// Create warehouse
exports.createWarehouse = async (req, res) => {
  try {
    const { name, shortCode, address } = req.body;

    if (!name || !shortCode || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const warehouse = await Warehouse.create({ name, shortCode, address });
    res.status(201).json(warehouse);
  } catch (error) {
    console.error("Create warehouse error", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Short code already exists" });
    }
    res.status(500).json({ message: "Failed to create warehouse" });
  }
};

// Update warehouse
exports.updateWarehouse = async (req, res) => {
  try {
    const { name, shortCode, address } = req.body;
    
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { name, shortCode, address },
      { new: true, runValidators: true }
    );

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.json(warehouse);
  } catch (error) {
    console.error("Update warehouse error", error);
    res.status(500).json({ message: "Failed to update warehouse" });
  }
};

// Delete warehouse
exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    console.error("Delete warehouse error", error);
    res.status(500).json({ message: "Failed to delete warehouse" });
  }
};
