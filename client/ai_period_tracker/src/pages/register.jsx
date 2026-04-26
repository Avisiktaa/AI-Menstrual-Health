import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../firebase/auth";
import { useLanguage } from "../context/LanguageContext";
import "./home.css";
import "./login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="lang-selector">
        <button className={language === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLanguage("en")}>EN</button>
        <button className={language === "hi" ? "lang-btn active" : "lang-btn"} onClick={() => setLanguage("hi")}>हि</button>
        <button className={language === "bn" ? "lang-btn active" : "lang-btn"} onClick={() => setLanguage("bn")}>বাং</button>
      </div>
      <div className="auth-heading">
        <h1>
          {t.appName.split("").map((char, i) => (
            <span key={i} className="auth-heading-letter" style={{ animationDelay: `${i * 0.1}s` }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>
      <div className="auth-container">
        <h2>{t.register}</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <input
              type="password"
              placeholder={t.passwordHint}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn">{t.register}</button>
        </form>
        <p className="auth-link">{t.haveAccount} <Link to="/login">{t.login}</Link></p>
      </div>
    </>
  );
};

export default Register;
