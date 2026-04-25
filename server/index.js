const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ==============================
// MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// ROUTES
// ==============================
const predictRoute = require("./routes/predict");
const adviceRoute = require("./routes/advice");

// Main APIs
app.use("/predict", predictRoute);
app.use("/advice", adviceRoute);

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.json({
    message: "Backend running 🚀",
    endpoints: ["/predict", "/advice"]
  });
});

// ==============================
// ERROR HANDLING (IMPORTANT)
// ==============================
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Something went wrong"
  });
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});