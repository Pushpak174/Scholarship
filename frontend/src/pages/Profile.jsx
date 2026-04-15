import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMe, updateProfile } from "../api";
import { useToast } from "../context/ToastContext";

const CATEGORIES = ["GEN", "OBC", "SC", "ST", "EWS"];
const COURSES = ["Engineering", "Science", "Arts", "Commerce", "Medical", "Any"];

// --- Helper for Avatar ---
const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

const getAvatarColor = (name) => {
  const colors = ["#4F46E5", "#059669", "#D97706", "#DB2777", "#2563EB", "#7C3AED"];
  if (!name) return colors[0];
  const charCodeSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

// --- SVG Components ---
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const LoaderIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
    <style>{`.spin { animation: rotate 2s linear infinite; } @keyframes rotate { to { transform: rotate(360deg); } }`}</style>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ course: "", gpa: "", location: "", categories: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getMe()
      .then((res) => {
        if (!res.data) { setUser(null); return; }
        setUser(res.data);
        setForm(res.data.profile || { course: "", gpa: "", location: "", categories: [] });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (cat) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      window.dispatchEvent(new Event("savedUpdated"));
      toast("Profile updated successfully!", "success");
    } catch {
      toast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    background: "var(--bg2)",
    color: "var(--text)",
    fontSize: "0.88rem",
    fontFamily: "var(--font)",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--text3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
    display: "block",
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "120px 0", color: "var(--text3)" }}>
        <div style={{ marginBottom: 16, color: "var(--accent)" }}><LoaderIcon /></div>
        <p style={{ fontWeight: 500 }}>Fetching your data...</p>
      </div>
    </>
  );

  if (!user) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "120px 0" }}>
        <div style={{ color: "var(--text3)", marginBottom: 16 }}><UserIcon /></div>
        <p style={{ color: "var(--text2)", fontWeight: 500 }}>Please login again to view your profile.</p>
      </div>
    </>
  );

  const profileComplete = form.course && form.gpa && form.location && form.categories?.length > 0;

  return (
    <>
      <Navbar />
      <div style={{ padding: "40px 24px", maxWidth: 680, margin: "0 auto" }}>

       
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", margin: 0 }}>
              {user.name}
            </h1>
            <p style={{ color: "var(--text3)", fontSize: "0.9rem", marginTop: 4 }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Completion banner */}
        {!profileComplete && (
          <div style={{
            marginBottom: 24, padding: "14px 18px",
            background: "color-mix(in srgb, var(--accent) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
            borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ color: "var(--accent)" }}><InfoIcon /></div>
            <span style={{ fontSize: "0.88rem", color: "var(--text)", fontWeight: 500 }}>
              Complete all fields to unlock personalized scholarship matches.
            </span>
          </div>
        )}

        {/* Academic profile card */}
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", padding: "28px",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ color: "var(--accent)" }}><BookIcon /></div>
            <p style={{ ...labelStyle, marginBottom: 0 }}>Academic Profile</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Current Course</label>
              <select
                style={inputStyle}
                value={form.course}
                onChange={e => setForm({ ...form, course: e.target.value })}
              >
                <option value="">Select course…</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>CGPA / Percentage</label>
              <input
                type="number"
                min="0" max="10" step="0.1"
                placeholder="e.g. 8.5"
                style={inputStyle}
                value={form.gpa}
                onChange={e => setForm({ ...form, gpa: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>State / Location</label>
            <input
              type="text"
              placeholder="e.g. Assam, Delhi…"
              style={inputStyle}
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Category (select all that apply)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {CATEGORIES.map(cat => {
                const selected = form.categories?.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid",
                      borderColor: selected ? "var(--accent)" : "var(--border)",
                      background: selected ? "var(--accent)" : "var(--bg2)",
                      color: selected ? "white" : "var(--text2)",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                padding: "12px 32px",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "var(--radius-sm)",
                border: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
                transition: "transform 0.1s active",
              }}
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}