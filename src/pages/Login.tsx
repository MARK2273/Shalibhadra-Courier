import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { currentConfig } from "../constants/courierConfig";
import AuthCard from "../components/ui/AuthCard";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import "../../styles/OneCourierTheme.css";

// Simple Icon Components for cleaner imports
const MailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const Login = () => {
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
        <div className="oc-brand-content">
          <div className="oc-brand-header">
            <h1>{currentConfig.displayName}</h1>
            <p>Fast. Secure. Reliable Deliveries.</p>
          </div>

          {/* Optional: Add a subtle illustration or visual here if needed */}
        </div>
      </div>

      {/* Right: Form Section */}
      <div className="oc-form-section">
        <AuthCard
          title="Sign in to OneCourier"
          subtext="Manage your shipments seamlessly"
        >
          <form onSubmit={handleLogin}>
            <InputField
              label="Email Address"
              placeholder="you@company.com"
              type="email"
              icon={<MailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Password"
              placeholder="••••••••"
              type="password"
              icon={<LockIcon />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="oc-error-msg">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              style={{ marginTop: "2rem" }}
            >
              Sign In
            </Button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
