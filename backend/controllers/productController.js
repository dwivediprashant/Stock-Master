const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  const { name, sku, category, unitOfMeasure, description, price, minStockLevel } = req.body;

  try {
    const productExists = await Product.findOne({ sku });

    if (productExists) {
      return res.status(400).json({ message: "Product with this SKU already exists" });
    }

    const product = await Product.create({
      name,
      sku,
      category,
      unitOfMeasure,
      description,
      price,
      minStockLevel,
      currentStock: 0, // Initial stock should be handled via Receipts/Adjustments ideally, but 0 is safe default
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  const { name, sku, category, unitOfMeasure, description, price, minStockLevel } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.unitOfMeasure = unitOfMeasure || product.unitOfMeasure;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.minStockLevel = minStockLevel !== undefined ? minStockLevel : product.minStockLevel;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all product categories
// @route   GET /api/products/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all product units
// @route   GET /api/products/units
// @access  Private
const getUnits = async (req, res) => {
  try {
    const units = await Product.distinct("unitOfMeasure");
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getUnits,
};
