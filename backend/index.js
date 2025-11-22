require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

// Global middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/warehouses", require("./routes/warehouseRoutes"));
app.use("/api/operations", require("./routes/operationRoutes"));
app.use("/api/moves", require("./routes/stockMoveRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
