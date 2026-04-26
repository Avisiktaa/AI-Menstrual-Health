const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==============================
// CALL PYTHON MODEL
// ==============================
function runML(longCycle, irregularScore, variation, lengthOfCycle) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../../ml-service/predict.py");
    const py = spawn("python", [
      scriptPath,
      longCycle,
      irregularScore,
      variation,
      lengthOfCycle,
    ]);

    let result = "";
    let error = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (err) => {
      error += err.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        reject(error || "Python script failed");
        return;
      }
      try {
        resolve(JSON.parse(result));
      } catch {
        reject("Invalid ML response: " + result);
      }
    });
  });
}

// ==============================
// MAIN ROUTE
// ==============================
router.post("/", async (req, res) => {
  try {
    const { cycles, symptoms = [], lang = 'en' } = req.body;

    // 1. AVG
    const avg = cycles.reduce((sum, val) => sum + val, 0) / cycles.length;

    // 2. FIND MAX CYCLE (most important for risk assessment)
    const maxCycle = Math.max(...cycles);
    
    // 3. VARIATION (use max cycle for variation calculation)
    const variation = Math.abs(maxCycle - avg);

    // 4. LONG CYCLE (check if max cycle > 35)
    const longCycle = maxCycle > 35 ? 1 : 0;

    // 5. MENSES SCORE
    let mensesScore = 0;

    if (symptoms.includes("pain")) mensesScore += 2;
    if (symptoms.includes("heavy_flow")) mensesScore += 2;
    if (symptoms.includes("missed_period")) mensesScore += 3;
    if (symptoms.includes("irregular")) mensesScore += 2;

    // 6. IRREGULAR SCORE
    const irregularScore = variation + mensesScore;

    // 7. CALL ML
    const mlResult = await runML(
      longCycle,
      irregularScore,
      variation,
      maxCycle
    );

    // 7. GET GEMINI ADVICE
    let advice = null;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const languageMap = { 'hi': 'Hindi', 'bn': 'Bengali', 'en': 'English' };
      const targetLang = languageMap[lang] || 'English';

      const prompt = `
You are a menstrual health assistant.
Provide brief, actionable advice for a person with the following data:
Cycles: ${cycles.join(", ")} days
Symptoms: ${symptoms.join(", ") || "none"}
PCOD Risk: ${mlResult.risk}

Rules:
- No diagnosis, No medicines.
- Support the user.
- Keep it under 50 words.
- IMPORTANT: You MUST respond strictly in ${targetLang}. Use the appropriate script (Devanagari for Hindi, Bengali script for Bengali).
`;
      
      const result = await model.generateContent(prompt);
      advice = result.response.text();
    } catch (err) {
      console.error("Gemini error:", err.message);
      advice = "Unable to generate advice at this time.";
    }

    // 8. RESPONSE
    res.json({
      predictedCycle: Math.round(avg),
      irregularScore,
      risk: mlResult.risk,
      confidence: mlResult.confidence,
      advice: advice
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;