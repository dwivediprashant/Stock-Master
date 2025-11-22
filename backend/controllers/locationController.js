const Location = require("../models/Location");

// Get all locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate("warehouse").sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    console.error("Get locations error", error);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
};

// Get single location
exports.getLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate("warehouse");
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    console.error("Get location error", error);
    res.status(500).json({ message: "Failed to fetch location" });
  }
};

// Create location
exports.createLocation = async (req, res) => {
  try {
    const { name, sortCode, warehouse } = req.body;

    if (!name || !sortCode || !warehouse) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const location = await Location.create({ name, sortCode, warehouse });
    const populated = await Location.findById(location._id).populate("warehouse");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Create location error", error);
    res.status(500).json({ message: "Failed to create location" });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const { name, sortCode, warehouse } = req.body;
    
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, sortCode, warehouse },
      { new: true, runValidators: true }
    ).populate("warehouse");

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    console.error("Update location error", error);
    res.status(500).json({ message: "Failed to update location" });
  }
};

// Delete location
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Delete location error", error);
    res.status(500).json({ message: "Failed to delete location" });
  }
};
