const BASE_URL = "http://localhost:5000";

export const getPrediction = async (cycles, symptoms, language = "en") => {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cycles, symptoms, language }),
  });
  return response.json();
};
