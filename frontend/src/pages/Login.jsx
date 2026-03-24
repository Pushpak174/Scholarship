import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";
import { useToast } from "../context/ToastContext";

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
      toast("Welcome back! 🎓", "success");
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
        width: "100%", maxWidth: 420,
        background: "var(--surface)", borderRadius: "var(--radius)",
        border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", padding: "40px 36px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
            ScholarFind
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginTop: 4 }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com" required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={inputStyle} />
          </div>
          <button type="submit" disabled={loading} style={btnStyle(loading)}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", color: "var(--text3)" }}>
          No account?{" "}
          <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: "0.9rem", fontFamily: "var(--font)", outline: "none", transition: "border-color 0.2s" };
const btnStyle = (loading) => ({ width: "100%", padding: "12px", borderRadius: "var(--radius-sm)", background: loading ? "var(--text3)" : "var(--accent)", color: "#fff", border: "none", fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font)", transition: "all 0.2s", marginTop: 4 });