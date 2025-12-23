import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api";

function getInitials(name = "") {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : parts[0][0].toUpperCase() +
        parts[parts.length - 1][0].toUpperCase();
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation(); // 🔥 KEY

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location.pathname]); // 🔥 refetch on route change

  return (
    <div className="flex justify-between px-6 py-3 border-b bg-white">
      {/* AVATAR */}
      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
        {user ? getInitials(user.name) : "?"}
      </div>

      {/* NAV */}
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
          className="text-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
