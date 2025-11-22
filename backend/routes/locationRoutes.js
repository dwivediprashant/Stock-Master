const express = require("express");
const router = express.Router();
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationController");
const authenticate = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", getLocations);
router.get("/:id", getLocation);
router.post("/", createLocation);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

module.exports = router;
