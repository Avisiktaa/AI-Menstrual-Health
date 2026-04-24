import React from "react";

const ResultCard = ({ result }) => {
  if (!result) return null;

  return (
    <div>
      <h2>Prediction Result</h2>
      <p>Predicted Cycle: {result.predicted_cycle} days</p>
      <p>Risk Level: {result.risk}</p>
    </div>
  );
};

export default ResultCard;