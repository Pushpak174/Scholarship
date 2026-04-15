import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api";
import { useToast } from "../context/ToastContext";

// --- SVG Icons ---
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

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", course: "", gpa: "", location: "", categories: [] });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const toggleCat = (cat) => setForm(p => ({
    ...p, categories: p.categories.includes(cat)
      ? p.categories.filter(c => c !== cat)
      : [...p.categories, cat]
  }));

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast("Name, email and password are required", "error"); return; }
    if (form.categories.length === 0) { toast("Please select at least one category", "error"); return; }
    setLoading(true);
    try {
      const res = await signup({
        name: form.name, email: form.email, password: form.password,
        profile: { course: form.course, gpa: Number(form.gpa), location: form.location, categories: form.categories }
      });
      localStorage.setItem("token", res.data.token);
      toast("Account created! Welcome to ScholarFind", "success");
      setTimeout(() => navigate("/personalized"), 600);
    } catch (err) {
      toast(err.response?.data?.error || "Signup failed", "error");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 520, background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", padding: "48px 40px" }}>
        
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ color: "var(--accent)", display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <GraduationCap />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em", margin: 0 }}>Create Account</h1>
          <p style={{ color: "var(--text3)", fontSize: "0.875rem", marginTop: 8 }}>Join ScholarFind to discover opportunities tailored for you.</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={rowStyle}>
            <Field label="Full Name" name="name" onChange={handleChange} required placeholder="John Doe" />
            <Field label="Email" name="email" type="email" onChange={handleChange} required placeholder="john@example.com" />
          </div>
          <Field label="Password" name="password" type="password" onChange={handleChange} required placeholder="••••••••" />

          <div style={sectionDivider}>Academic Profile</div>

          <div style={rowStyle}>
            <Field label="Course / Degree" name="course" onChange={handleChange} placeholder="e.g. Engineering" />
            <Field label="CGPA" name="gpa" type="number" step="0.01" min="0" max="10" onChange={handleChange} placeholder="8.5" />
          </div>
          <Field label="Location / State" name="location" onChange={handleChange} placeholder="e.g. Assam, Delhi" />

          <div>
            <label style={labelStyle}>Category</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {["GEN", "OBC", "SC", "ST", "EWS"].map(cat => {
                const isActive = form.categories.includes(cat);
                return (
                  <button key={cat} type="button" onClick={() => toggleCat(cat)} style={{
                    padding: "7px 16px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s",
                    background: isActive ? "var(--accent)" : "var(--bg2)",
                    color: isActive ? "#fff" : "var(--text2)",
                    border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                  }}>{cat}</button>
                );
              })}
            </div>
          </div>

          <div style={sectionDivider}>Disability Status (Optional)</div>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Visual", "Hearing", "Locomotor", "Learning"].map(cat => {
                const isActive = form.categories.includes(cat);
                return (
                  <button key={cat} type="button" onClick={() => toggleCat(cat)} style={{
                    padding: "6px 14px", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s",
                    background: isActive ? "#6b46c1" : "var(--bg2)",
                    color: isActive ? "#fff" : "var(--text2)",
                    border: `1px solid ${isActive ? "#6b46c1" : "var(--border)"}`,
                  }}>{cat}</button>
                );
              })}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 10, lineHeight: 1.5 }}>
              Selecting these helps us find specialized grants from NHFDC and State Govts.
            </p>
          </div>

          <button type="submit" disabled={loading} style={{ ...btnStyle, marginTop: 12, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Creating account..." : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Get Started <ArrowRight />
              </span>
            )}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: "center", fontSize: "0.875rem", color: "var(--text3)", borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", onChange, placeholder, required, step, min, max }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={labelStyle}>{label}{required && " *"}</label>
      <input name={name} type={type} onChange={onChange} placeholder={placeholder}
        required={required} step={step} min={min} max={max}
        style={{ width: "100%", padding: "12px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: "0.9rem", fontFamily: "var(--font)", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} 
      />
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.025em" };
const rowStyle = { display: "flex", gap: 16 };
const sectionDivider = { fontSize: "0.75rem", fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 8, marginBottom: 8 };
const btnStyle = { width: "100%", padding: "14px", borderRadius: "var(--radius-sm)", background: "var(--accent)", color: "#fff", border: "none", fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font)", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(var(--accent-rgb), 0.2)" };