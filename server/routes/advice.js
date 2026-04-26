const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { cycles, symptoms, risk, message, lang = 'en' } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    let prompt = ``;
    
    if (message) {
      prompt = `
You are a menstrual health AI assistant. You ONLY provide advice related to menstrual health, PCOD/PCOS, reproductive health, and related wellness topics.

CRITICAL RESTRICTION:
- If the user asks ANYTHING not related to menstrual/reproductive health (like math, coding, general knowledge, etc.), respond ONLY with: "I'm a menstrual health assistant and can only provide advice related to menstrual health, PCOD/PCOS, and reproductive wellness. Please ask health-related questions."

The user's context (if provided):
Cycles: ${cycles}
Symptoms: ${symptoms}
Risk: ${risk}

User Message: "${message}"

Rules:
- Give general health advice only for menstrual/reproductive health topics
- Explicitly state this is not a medical diagnosis
- Keep it concise, friendly, and supportive
- Do NOT prescribe medicines
- Respond strictly in ${lang === 'hi' ? 'Hindi' : lang === 'bn' ? 'Bengali' : 'English'}
`;
    } else {
      prompt = `
You are a menstrual health assistant. You ONLY provide advice related to menstrual health, PCOD/PCOS, reproductive health, and related wellness topics.

Rules:
- No diagnosis
- No medicines
- Only general advice related to menstrual/reproductive health
- Keep it short and helpful

User Data:
Cycles: ${cycles}
Symptoms: ${symptoms}
Risk: ${risk}

Give advice.
Respond strictly in ${lang === 'hi' ? 'Hindi' : lang === 'bn' ? 'Bengali' : 'English'}.
`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ advice: text });

  } catch (error) {
    console.error("Gemini Chat Error:", error.message);
    res.json({ advice: "I am currently over-capacity or experiencing a connection issue. Please try again in a few minutes!" });
  }
});

module.exports = router;