import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../firebase/auth";
import "./home.css";
import "./login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="auth-heading">
        <h1>
          {"AI-Menstrual Health".split("").map((char, i) => (
            <span key={i} className="auth-heading-letter" style={{ animationDelay: `${i * 0.1}s` }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-btn">Register</button>
      </form>
      <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
    </div>
    </>
  );
};

export default Register;