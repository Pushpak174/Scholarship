import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AllScholarships from "./pages/AllScholarships";
import PersonalizedScholarships from "./pages/PersonalizedScholarships";
import SavedScholarships from "./pages/SavedScholarships";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main app routes */}
        <Route path="/" element={<AllScholarships />} />
        <Route path="/personalized" element={<PersonalizedScholarships />} />
        <Route path="/saved" element={<SavedScholarships />} />
        <Route path="/profile" element={<Profile />} />

        {/* Catch-all (404 protection) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
