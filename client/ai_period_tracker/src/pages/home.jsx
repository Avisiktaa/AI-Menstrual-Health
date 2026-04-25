import React, { useState, useEffect, useRef } from "react";
import CycleForm from "../components/cycleform";
import Dashboard from "../components/dashboard";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getPrediction } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "./home.css";

const Home = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastData = useRef(null);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => navigate("/login"));
  };

  const fetchResult = async (data, lang) => {
    setLoading(true);
    try {
      const res = await getPrediction(data.cycles, data.symptoms, lang);
      setResult(res);
    } catch (err) {
      console.error("API error:", err);
    }
    setLoading(false);
  };

  const handleSubmit = (data) => {
    lastData.current = data;
    fetchResult(data, language);
  };

  useEffect(() => {
    if (lastData.current) {
      fetchResult(lastData.current, language);
    }
  }, [language]);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>{t.healthTracker}</h1>
        <div className="header-right">
          <div className="lang-selector">
            <button className={language === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLanguage("en")}>EN</button>
            <button className={language === "hi" ? "lang-btn active" : "lang-btn"} onClick={() => setLanguage("hi")}>हि</button>
            <button className={language === "bn" ? "lang-btn active" : "lang-btn"} onClick={() => setLanguage("bn")}>বাং</button>
          </div>
          <button className="logout-btn" onClick={handleLogout}>{t.logout}</button>
        </div>
      </div>

      <div className="card">
        <CycleForm onSubmit={handleSubmit} />
      </div>

      {loading && <p style={{ textAlign: "center", marginTop: 20 }}>{t.analyzing}</p>}

      {result && (
        <div className="card result-card">
          <Dashboard result={result} />
        </div>
      )}
    </div>
  );
};

export default Home;
