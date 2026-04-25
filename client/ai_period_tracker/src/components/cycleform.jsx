import React, { useState } from "react";
import "./cycleform.css";
import { useLanguage } from "../context/LanguageContext";

const SYMPTOM_KEYS = ["pain", "heavy_flow", "missed_period", "irregular"];

const CycleForm = ({ onSubmit }) => {
  const [cycles, setCycles] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const { t } = useLanguage();

  const toggleSymptom = (value) => {
    setSymptoms((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      cycles: cycles.split(",").map(Number),
      symptoms,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t.enterCycleData}</h2>

      <label>{t.cyclePlaceholder}</label>
      <input
        type="text"
        placeholder={t.cycleInput}
        value={cycles}
        onChange={(e) => setCycles(e.target.value)}
        required
      />

      <label>{t.symptoms}</label>
      <div className="symptom-options">
        {SYMPTOM_KEYS.map((key) => (
          <button
            type="button"
            key={key}
            className={`symptom-btn ${symptoms.includes(key) ? "active" : ""}`}
            onClick={() => toggleSymptom(key)}
          >
            {t.symptomOptions[key]}
          </button>
        ))}
      </div>

      <button type="submit">{t.analyze}</button>
    </form>
  );
};

export default CycleForm;
