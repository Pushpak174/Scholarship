import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMe, updateProfile } from "../api";
import { useToast } from "../context/ToastContext";

const CATEGORIES = ["GEN", "OBC", "SC", "ST", "EWS"];
const COURSES = ["Engineering", "Science", "Arts", "Commerce", "Medical", "Any"];

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
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>Loading profile…
      </div>
    </>
  );

  if (!user) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔒</div>
        <p style={{ color: "var(--text3)" }}>Please login again to view your profile.</p>
      </div>
    </>
  );

  const profileComplete = form.course && form.gpa && form.location && form.categories?.length > 0;

  return (
    <>
      <Navbar />
      <div style={{ padding: "28px 24px", maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
            Your Profile
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginTop: 4 }}>
            Keep this updated to get the best scholarship recommendations
          </p>
        </div>

        {/* Completion banner */}
        {!profileComplete && (
          <div style={{
            marginBottom: 20, padding: "12px 16px",
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
            borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: "1.1rem" }}>💡</span>
            <span style={{ fontSize: "0.84rem", color: "var(--text)" }}>
              Complete all fields to unlock personalized scholarship matches
            </span>
          </div>
        )}

        {/* Account info card */}
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", padding: "20px 24px", marginBottom: 20,
        }}>
          <p style={{ ...labelStyle, marginBottom: 14 }}>Account</p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: 2 }}>Name</p>
              <p style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.95rem" }}>{user.name}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: 2 }}>Email</p>
              <p style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.95rem" }}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Academic profile card */}
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", padding: "20px 24px",
        }}>
          <p style={{ ...labelStyle, marginBottom: 18 }}>Academic Profile</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Course */}
            <div>
              <label style={labelStyle}>Course</label>
              <select
                style={inputStyle}
                value={form.course}
                onChange={e => setForm({ ...form, course: e.target.value })}
              >
                <option value="">Select course…</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* CGPA */}
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

          {/* Location */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>State / Location</label>
            <input
              type="text"
              placeholder="e.g. Assam, Delhi…"
              style={inputStyle}
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Category chips */}
          <div>
            <label style={labelStyle}>Category (select all that apply)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.map(cat => {
                const selected = form.categories?.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 999,
                      border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                      background: selected ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "var(--bg2)",
                      color: selected ? "var(--accent)" : "var(--text3)",
                      fontWeight: selected ? 700 : 500,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      fontFamily: "var(--font)",
                      transition: "all 0.15s",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save button */}
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                padding: "10px 28px",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "var(--radius-sm)",
                border: "none",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "var(--font)",
                opacity: saving ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}