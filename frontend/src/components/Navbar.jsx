import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      style={{
        color: location.pathname === to ? "var(--accent)" : "var(--text2)",
        textDecoration: "none",
        fontSize: "0.875rem",
        fontWeight: 500,
        padding: "6px 12px",
        borderRadius: "var(--radius-sm)",
        background: location.pathname === to ? "var(--accent-light)" : "transparent",
        transition: "all 0.2s",
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "var(--shadow)",
    }}>
      <Link to="/all" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "1.2rem" }}>🎓</span>
        <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--accent)", letterSpacing: "-0.02em" }}>
          ScholarFind
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {navLink("/scholarships", "All")}
        {navLink("/personalized", "For You")}
        {navLink("/saved", "Saved")}
        {navLink("/profile", "Profile")}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={toggle}
          title="Toggle dark mode"
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: "1rem",
            color: "var(--text)",
            transition: "all 0.2s",
          }}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        <button
          onClick={logout}
          style={{
            background: "var(--accent-light)",
            border: "1px solid var(--accent)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--accent)",
            fontFamily: "var(--font)",
            transition: "all 0.2s",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}