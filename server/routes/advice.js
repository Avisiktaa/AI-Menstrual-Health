const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { cycles, symptoms, risk } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a menstrual health assistant.

Rules:
- No diagnosis
- No medicines
- Only general advice
- Keep it short and helpful

User Data:
Cycles: ${cycles}
Symptoms: ${symptoms}
Risk: ${risk}

Give advice.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ advice: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini failed" });
  }
});

module.exports = router;