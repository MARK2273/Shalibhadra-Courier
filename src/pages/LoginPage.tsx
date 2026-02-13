import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { currentConfig } from "../constants/courierConfig";
import AuthCard from "../components/ui/AuthCard";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import "../styles/OneCourierTheme.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/form");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="oc-login-page">
      {/* Left: Brand Section */}
      <div className="oc-brand-section">
        <div className="oc-brand-header">
          <h1>{currentConfig.displayName}</h1>
          <p>Delivering Faster. Smarter. Reliable.</p>
        </div>

        <div className="oc-illustration">
          {/* Subtle SVG Illustration Placeholder */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>

        <div style={{ opacity: 0.7, fontSize: "0.85rem" }}>
          &copy; {new Date().getFullYear()} {currentConfig.name} System. All
          rights reserved.
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="oc-form-section">
        <AuthCard
          title="Welcome Back"
          subtext="Login to manage your courier operations"
        >
          <form onSubmit={handleLogin}>
            <InputField
              label="Email Address"
              placeholder="admin@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="oc-error-msg" style={{ marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default LoginPage;
