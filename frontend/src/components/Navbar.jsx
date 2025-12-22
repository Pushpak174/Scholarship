import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api";

function getInitials(name = "") {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (
    parts[0][0].toUpperCase() +
    parts[parts.length - 1][0].toUpperCase()
  );
}

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null)); // 🔥 VERY IMPORTANT
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-3 border-b bg-white">
      {/* LEFT: AVATAR */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {getInitials(user.name)}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300" />
        )}
      </div>

      {/* RIGHT: LINKS */}
      <div className="flex gap-4 items-center">
        <Link to="/">All</Link>
        <Link to="/personalized">Recommended</Link>
        <Link to="/saved">Saved</Link>
        <Link to="/profile">Profile</Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="text-red-600 ml-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
