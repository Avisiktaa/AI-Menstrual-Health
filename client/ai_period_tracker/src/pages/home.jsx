import React, { useState } from "react";
import CycleForm from "../components/cycleform";
import Dashboard from "../components/dashboard";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => navigate("/login"));
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>🌸 Health Tracker</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="card">
        <CycleForm setResult={setResult} />
      </div>

      {result && (
        <div className="card result-card">
          <Dashboard result={result} />
        </div>
      )}
    </div>
  );
};

export default Home;