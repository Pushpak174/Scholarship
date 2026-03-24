import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllScholarships from "./pages/AllScholarships";
import PersonalizedScholarships from "./pages/PersonalizedScholarships";
import SavedScholarships from "./pages/SavedScholarships";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Default redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected routes */}
            <Route path="/scholarships" element={<ProtectedRoute><AllScholarships /></ProtectedRoute>} />
            <Route path="/personalized" element={<ProtectedRoute><PersonalizedScholarships /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><SavedScholarships /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}