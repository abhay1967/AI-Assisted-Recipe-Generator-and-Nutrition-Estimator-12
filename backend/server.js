require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Routes
const ingredientRoutes = require("./routes/ingredientRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

// ✅ CORS (Vercel + Localhost allowed)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-assisted-recipe-generator-and-nu.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Connect MongoDB
connectDB();

// Debug env
console.log("USDA KEY LOADED:", !!process.env.USDA_API_KEY);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "recipe-backend" });
});

// API routes
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favorites", favoriteRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
