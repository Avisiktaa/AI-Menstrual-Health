import React, { useState } from "react";
import "./cycleform.css";

const CycleForm = ({ onSubmit }) => {
  const [cycles, setCycles] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [weight, setWeight] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      cycles: cycles.split(",").map(Number),
      symptoms: symptoms.split(","),
      weight: Number(weight)
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Your Cycle Data</h2>

      <input
        type="text"
        placeholder="Cycles (e.g. 28,30,32)"
        value={cycles}
        onChange={(e) => setCycles(e.target.value)}
      />

      <input
        type="text"
        placeholder="Symptoms (e.g. acne, fatigue)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <input
        type="number"
        placeholder="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button type="submit">Analyze</button>
    </form>
  );
};

export default CycleForm;