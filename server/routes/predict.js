const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { cycles } = req.body;

  if (!cycles || cycles.length === 0) {
    return res.status(400).json({ error: "No cycle data" });
  }

  // 1. Average
  const avg = cycles.reduce((a, b) => a + b, 0) / cycles.length;

  // 2. Standard deviation
  const variance =
    cycles.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
    cycles.length;

  const stdDev = Math.sqrt(variance);

  // 3. Risk logic
  let risk = "Low";
  if (stdDev > 3) risk = "High";
  else if (stdDev > 1.5) risk = "Medium";

  res.json({
    predictedCycle: Math.round(avg),
    risk,
  });
});

module.exports = router;