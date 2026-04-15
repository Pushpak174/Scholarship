import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// --- SVG Icons ---
const GraduationCap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const Sun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const Moon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

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
        fontWeight: 600,
        padding: "8px 16px",
        borderRadius: "var(--radius-sm)",
        background: location.pathname === to ? "var(--accent-light)" : "transparent",
        transition: "all 0.2s ease",
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
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    }}>
      {/* Brand Section */}
      <Link to="/scholarships" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, color: "var(--accent)" }}>
        <GraduationCap />
        <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
          ScholarFind
        </span>
      </Link>

      {/* Central Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {navLink("/scholarships", "Explore")}
        {navLink("/personalized", "Matches")}
        {navLink("/saved", "Saved")}
        {navLink("/profile", "Profile")}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={toggle}
          title="Toggle theme"
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text)",
            transition: "all 0.2s",
          }}
        >
          {dark ? <Moon /> : <Sun />}
        </button>

        <button
          onClick={logout}
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#fff", // Assuming accent is a primary color
            display: "flex",
            alignItems: "center",
            fontFamily: "inherit",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
        >
          <LogOutIcon />
          Logout
        </button>
      </div>
    </nav>
  );
}