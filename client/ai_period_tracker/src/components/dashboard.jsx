import React from "react";
import "./dashboard.css";

const Dashboard = ({ result }) => {
  return (
    <div className="dashboard">
  <h2>📊 Your Results</h2>

  <p>Predicted Cycle: {result.predicted_cycle} days</p>

  <p className={`risk ${result.risk.toLowerCase()}`}>
    Risk: {result.risk}
  </p>

  <p>Advice: {result.advice}</p>
</div>
       
  );
};

export default Dashboard;