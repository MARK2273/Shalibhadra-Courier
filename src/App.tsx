import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CourierForm from "./components/CourierForm";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ShipmentDetails from "./pages/ShipmentDetails";
import Layout from "./components/layout/Layout";

import { useEffect } from "react";
import { currentConfig } from "./constants/courierConfig";

function App() {
  useEffect(() => {
    // Update Title
    document.title = currentConfig.displayName;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form" element={<CourierForm />} />
            <Route path="/form/:id" element={<CourierForm />} />
            <Route path="/shipments/:id" element={<ShipmentDetails />} />
          </Route>
        </Route>

        {/* Catch all - redirect to dashboard if logged in, else landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
