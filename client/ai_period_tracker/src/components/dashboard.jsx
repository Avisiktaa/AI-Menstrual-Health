import React from "react";
import "./dashboard.css";
import { useLanguage } from "../context/LanguageContext";

const Dashboard = ({ result }) => {
  const { t } = useLanguage();
  if (!result) return null;

  return (
    <div className="dashboard">
      <h2>{t.yourResults}</h2>
      <p>{t.predictedCycle}: <strong>{result.predictedCycle} {t.days}</strong></p>
      {result.risk && (
        <p className={`risk ${result.risk.toLowerCase()}`}>{t.risk}: {t.riskLevels[result.risk] || result.risk}</p>
      )}
      {result.confidence && (
        <p>{t.confidence}: {result.confidence}%</p>
      )}
      {result.advice && (
        <>
          <p><strong>{t.advice}:</strong></p>
          <p><strong>{result.advice}</strong></p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
