import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1>Welcome to Digital Bookstore</h1>

        <button
          className="landing-btn guest"
          onClick={() => navigate("/guest")}
        >
          Continue as Guest
        </button>

        <button
          className="landing-btn login"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="landing-btn signup"
          onClick={() => navigate("/signup")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}