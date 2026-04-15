import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { useToast } from "../context/ToastContext";

// --- SVG Components ---
const GraduationCap = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast("Please fill all fields", "error"); return; }
    setLoading(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.token);
      toast("Welcome back!", "success");
      setTimeout(() => navigate("/personalized"), 600);
    } catch (err) {
      toast(err.response?.data?.error || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "var(--surface)", borderRadius: "var(--radius)",
        border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", padding: "48px 40px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ color: "var(--accent)", display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <GraduationCap />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em", margin: 0 }}>
            ScholarFind
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.9rem", marginTop: 8 }}>
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com" 
              required 
              style={inputStyle} 
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={labelStyle}>Password</label>
              
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              style={inputStyle} 
            />
          </div>

          <button type="submit" disabled={loading} style={btnStyle(loading)}>
            {loading ? "Authenticating..." : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Sign In <ArrowRight />
              </span>
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)",
          textAlign: "center", fontSize: "0.875rem", color: "var(--text3)" 
        }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { 
  display: "block", 
  fontSize: "0.75rem", 
  fontWeight: 700, 
  color: "var(--text2)", 
  marginBottom: 8, 
  textTransform: "uppercase", 
  letterSpacing: "0.025em" 
};

const inputStyle = { 
  width: "100%", 
  padding: "12px 16px", 
  borderRadius: "var(--radius-sm)", 
  border: "1px solid var(--border)", 
  background: "var(--bg2)", 
  color: "var(--text)", 
  fontSize: "0.95rem", 
  fontFamily: "var(--font)", 
  outline: "none", 
  transition: "all 0.2s ease",
  boxSizing: "border-box"
};

const btnStyle = (loading) => ({ 
  width: "100%", 
  padding: "14px", 
  borderRadius: "var(--radius-sm)", 
  background: loading ? "var(--border)" : "var(--accent)", 
  color: "#fff", 
  border: "none", 
  fontSize: "0.95rem", 
  fontWeight: 700, 
  cursor: loading ? "not-allowed" : "pointer", 
  fontFamily: "var(--font)", 
  transition: "transform 0.1s active, opacity 0.2s",
  marginTop: 8,
  boxShadow: loading ? "none" : "0 4px 12px rgba(var(--accent-rgb), 0.2)"
});