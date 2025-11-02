import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "", terms: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const err = [];
    if (pwd.length < 8) err.push("8+ chars");
    if (!/[A-Z]/.test(pwd)) err.push("1 uppercase");
    if (!/[a-z]/.test(pwd)) err.push("1 lowercase");
    if (!/[0-9]/.test(pwd)) err.push("1 number");
    if (!/[^A-Za-z0-9]/.test(pwd)) err.push("1 special character");
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!formData.firstName.trim()) err.firstName = "Required";
    if (!formData.lastName.trim()) err.lastName = "Required";
    if (!formData.email.includes("@")) err.email = "Invalid email";
    const pwdErr = validatePassword(formData.password);
    if (pwdErr.length > 0) err.password = pwdErr.join(" | ");
    if (formData.password !== formData.confirmPassword) err.confirmPassword = "No match";
    if (!formData.terms) err.terms = "Accept terms";
    setErrors(err);
    if (Object.keys(err).length === 0) {
      alert("Account created!");
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up for an Account</h2>
        <p className="subtitle">
          Let's get you set up to start creating your first onboarding experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                name="firstName"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                name="lastName"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter strong password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <label className="terms-checkbox">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            I accept BoardMe's Terms & Conditions
          </label>
          {errors.terms && <span className="error">{errors.terms}</span>}

          <button type="submit" className="signup-btn">SIGN UP</button>
        </form>

        <div className="social-login">
          <p>Or sign up using</p>
          <div className="social-buttons">
            <button className="social-btn google">G</button>
            <button className="social-btn facebook">f</button>
            <button className="social-btn twitter">X</button>
          </div>
        </div>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="link">
            LOG IN
          </span>
        </p>
      </div>
    </div>
  );
}