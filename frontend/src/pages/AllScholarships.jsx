import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ScholarshipCard from "../components/ScholarshipCard";
import { getAllScholarships } from "../api";
import { useToast } from "../context/ToastContext";

export default function AllScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideExpired, setHideExpired] = useState(false);
  const toast = useToast();

  const [filters, setFilters] = useState({ category: "", course: "", currency: "", minAmount: "", maxAmount: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllScholarships(filters);
      const data = res.data?.data ?? res.data ?? [];
      const list = Array.isArray(data) ? data : [];
      setScholarships(list);
      if (list.length === 0) toast("No scholarships match your filters", "info");
    } catch {
      toast("Failed to load. Is your backend running?", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("savedUpdated", fetchData);
    return () => window.removeEventListener("savedUpdated", fetchData);
  }, [filters]);

  const now = new Date();
  const displayed = hideExpired
    ? scholarships.filter(s => !s.deadline || new Date(s.deadline) > now)
    : scholarships;

  const expiredCount = scholarships.filter(s => s.deadline && new Date(s.deadline) <= now).length;

  const selStyle = {
    padding: "8px 12px", borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)", background: "var(--surface)",
    color: "var(--text)", fontSize: "0.83rem", fontFamily: "var(--font)",
    cursor: "pointer", outline: "none",
  };
  const inputStyle = { ...selStyle, width: 110 };

  return (
    <>
      <Navbar />
      <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
            All Scholarships
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginTop: 4 }}>
            Browse all scholarships — expired ones are marked clearly
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24,
          padding: "16px", background: "var(--surface)",
          borderRadius: "var(--radius)", border: "1px solid var(--border)",
        }}>
          <select style={selStyle} value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
            <option value="">All Categories</option>
            {["GEN", "OBC", "SC", "ST", "EWS"].map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={selStyle} value={filters.course} onChange={e => setFilters(f => ({ ...f, course: e.target.value }))}>
            <option value="">All Courses</option>
            {["Engineering", "Science", "Arts", "Commerce", "Medical", "Any"].map(c => <option key={c}>{c}</option>)}
          </select>
          <select style={selStyle} value={filters.currency} onChange={e => setFilters(f => ({ ...f, currency: e.target.value }))}>
            <option value="">All Currencies</option>
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
          </select>
          <input type="number" placeholder="Min ₹/$" style={inputStyle}
            value={filters.minAmount} onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value }))} />
          <input type="number" placeholder="Max ₹/$" style={inputStyle}
            value={filters.maxAmount} onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value }))} />

          {/* Hide expired toggle */}
          {expiredCount > 0 && (
            <button
              onClick={() => setHideExpired(h => !h)}
              style={{
                padding: "8px 14px", borderRadius: "var(--radius-sm)", cursor: "pointer",
                border: `1px solid ${hideExpired ? "var(--accent)" : "var(--border)"}`,
                background: hideExpired ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg2)",
                color: hideExpired ? "var(--accent)" : "var(--text3)",
                fontSize: "0.8rem", fontFamily: "var(--font)", fontWeight: 600,
              }}
            >
              {hideExpired ? "✓ Hiding" : "Show"} expired ({expiredCount})
            </button>
          )}

          <button
            onClick={() => setFilters({ category: "", course: "", currency: "", minAmount: "", maxAmount: "" })}
            style={{
              padding: "8px 14px", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)", background: "var(--bg2)",
              color: "var(--text3)", fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--font)",
            }}
          >
            Reset
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>Loading...
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</div>
            No scholarships found for the selected filters.
          </div>
        ) : (
          <>
            <p style={{ fontSize: "0.82rem", color: "var(--text3)", marginBottom: 16 }}>
              Showing {displayed.length} scholarship{displayed.length !== 1 ? "s" : ""}
              {!hideExpired && expiredCount > 0 && (
                <span style={{ color: "#e53e3e", marginLeft: 6 }}>· {expiredCount} expired</span>
              )}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {displayed.map(s => <ScholarshipCard key={s._id} scholarship={s} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}