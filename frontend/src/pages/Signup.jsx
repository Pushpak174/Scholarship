import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api";
import { useToast } from "../context/ToastContext";

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", password:"", course:"", gpa:"", location:"", categories:[] });

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
      const res = await signup({ name: form.name, email: form.email, password: form.password,
        profile: { course: form.course, gpa: Number(form.gpa), location: form.location, categories: form.categories } });
      localStorage.setItem("token", res.data.token);
      toast("Account created! Welcome 🎓", "success");
      setTimeout(() => navigate("/personalized"), 600);
    } catch (err) {
      toast(err.response?.data?.error || "Signup failed", "error");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)", padding:24 }}>
      <div style={{ width:"100%", maxWidth:480, background:"var(--surface)", borderRadius:"var(--radius)", border:"1px solid var(--border)", boxShadow:"var(--shadow-lg)", padding:"36px" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:"2rem", marginBottom:6 }}>🎓</div>
          <h1 style={{ fontSize:"1.4rem", fontWeight:700, color:"var(--text)", letterSpacing:"-0.03em" }}>Create Account</h1>
          <p style={{ color:"var(--text3)", fontSize:"0.82rem", marginTop:4 }}>Fill in your profile to get matched scholarships</p>
        </div>

        <form onSubmit={handleSignup} style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={rowStyle}>
            <Field label="Full Name" name="name" onChange={handleChange} required />
            <Field label="Email" name="email" type="email" onChange={handleChange} required />
          </div>
          <Field label="Password" name="password" type="password" onChange={handleChange} required />

          <div style={sectionDivider}>Profile (for matching)</div>

          <div style={rowStyle}>
            <Field label="Course / Degree" name="course" onChange={handleChange} placeholder="e.g. Engineering" />
            <Field label="CGPA" name="gpa" type="number" step="0.01" min="0" max="10" onChange={handleChange} placeholder="e.g. 8.5" />
          </div>
          <Field label="Location / State" name="location" onChange={handleChange} placeholder="e.g. Assam" />

          <div>
            <label style={labelStyle}>Category (select all that apply)</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
              {["GEN","OBC","SC","ST","EWS"].map(cat => (
                <button key={cat} type="button" onClick={() => toggleCat(cat)} style={{
                  padding:"6px 14px", borderRadius:20, fontSize:"0.8rem", fontWeight:600,
                  cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s",
                  background: form.categories.includes(cat) ? "var(--accent)" : "var(--bg2)",
                  color: form.categories.includes(cat) ? "#fff" : "var(--text2)",
                  border: `1px solid ${form.categories.includes(cat) ? "var(--accent)" : "var(--border)"}`,
                }}>{cat}</button>
              ))}
            </div>
          </div>

          <div style={sectionDivider}>Persons with Disability</div>
          <div>
            <label style={labelStyle}>PWD Category (if applicable)</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
              {["Visual Impairment","Hearing Impairment","Locomotor Disability","Learning Disability","None"].map(cat => (
                <button key={cat} type="button" onClick={() => toggleCat(cat)} style={{
                  padding:"6px 14px", borderRadius:20, fontSize:"0.78rem", fontWeight:600,
                  cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s",
                  background: form.categories.includes(cat) ? "#6b46c1" : "var(--bg2)",
                  color: form.categories.includes(cat) ? "#fff" : "var(--text2)",
                  border: `1px solid ${form.categories.includes(cat) ? "#6b46c1" : "var(--border)"}`,
                }}>{cat}</button>
              ))}
            </div>
            <p style={{ fontSize:"0.73rem", color:"var(--text3)", marginTop:6 }}>
              PWD scholarships are available from NHFDC, UGC, and State Govts
            </p>
          </div>

          <button type="submit" disabled={loading} style={{ ...btnStyle, marginTop:8, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed":"pointer" }}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign:"center", marginTop:18, fontSize:"0.83rem", color:"var(--text3)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color:"var(--accent)", fontWeight:600, textDecoration:"none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type="text", onChange, placeholder, required, step, min, max }) {
  return (
    <div style={{ flex:1 }}>
      <label style={labelStyle}>{label}{required && " *"}</label>
      <input name={name} type={type} onChange={onChange} placeholder={placeholder}
        required={required} step={step} min={min} max={max}
        style={{ width:"100%", padding:"10px 12px", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)", background:"var(--bg2)", color:"var(--text)", fontSize:"0.88rem", fontFamily:"var(--font)", outline:"none" }} />
    </div>
  );
}

const labelStyle = { display:"block", fontSize:"0.73rem", fontWeight:600, color:"var(--text2)", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" };
const rowStyle = { display:"flex", gap:12 };
const sectionDivider = { fontSize:"0.73rem", fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.08em", borderTop:"1px solid var(--border)", paddingTop:12, marginTop:4 };
const btnStyle = { width:"100%", padding:"12px", borderRadius:"var(--radius-sm)", background:"var(--accent)", color:"#fff", border:"none", fontSize:"0.9rem", fontWeight:700, fontFamily:"var(--font)", transition:"all 0.2s" };