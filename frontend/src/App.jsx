import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllScholarships from "./pages/AllScholarships";
import PersonalizedScholarships from "./pages/PersonalizedScholarships";
import SavedScholarships from "./pages/SavedScholarships";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllScholarships />} />
        <Route path="/personalized" element={<PersonalizedScholarships />} />
        <Route path="/saved" element={<SavedScholarships />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
