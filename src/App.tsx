import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CourierForm from "./components/CourierForm";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/form" element={<CourierForm />} />
        </Route>
        <Route path="*" element={<Navigate to="/form" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
