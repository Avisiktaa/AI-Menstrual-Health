const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==============================
// CALL PYTHON MODEL
// ==============================
function runML(longCycle, irregularScore, variation, lengthOfCycle) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [
      "../ml-service/predict.py",
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
    const { cycles, symptoms = [], language = "en" } = req.body;

    const languageMap = {
      en: "English",
      hi: "Hindi",
      bn: "Bengali",
    };
    const respondInLanguage = languageMap[language] || "English";

    // 1. AVG
    const avg =
      cycles.reduce((sum, val) => sum + val, 0) / cycles.length;

    // 2. VARIATION
    const lastCycle = cycles[cycles.length - 1];
    const variation = Math.abs(lastCycle - avg);

    // 3. LONG CYCLE
    const longCycle = lastCycle > 35 ? 1 : 0;

    // 4. MENSES SCORE
    let mensesScore = 0;

    if (symptoms.includes("pain")) mensesScore += 2;
    if (symptoms.includes("heavy_flow")) mensesScore += 2;
    if (symptoms.includes("missed_period")) mensesScore += 3;
    if (symptoms.includes("irregular")) mensesScore += 2;

    // 5. IRREGULAR SCORE
    const irregularScore = variation + mensesScore;

    // 6. CALL ML
    const mlResult = await runML(
      longCycle,
      irregularScore,
      variation,
      lastCycle
    );

    // 7. GET GEMINI ADVICE
    let advice = null;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
You are a menstrual health assistant.

Rules:
- No diagnosis
- No medicines
- Only general advice
- Keep it short (3-4 sentences)
- Be supportive and helpful
- Respond ONLY in ${respondInLanguage}

User Data:
Cycles: ${cycles.join(", ")} days
Symptoms: ${symptoms.join(", ") || "none"}
PCOD Risk: ${mlResult.risk}
Confidence: ${mlResult.confidence}%

Provide brief, actionable advice in ${respondInLanguage}.
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