import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ScholarshipCard from "../components/ScholarshipCard";
import { getSavedScholarships } from "../api";
import { useToast } from "../context/ToastContext";

export default function SavedScholarships() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await getSavedScholarships();
      // Handle both res.data and res.data.data response shapes
      const data = res.data?.data ?? res.data ?? [];
      setList(Array.isArray(data) ? data : []);
    } catch {
      toast("Failed to load saved scholarships", "error");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
    window.addEventListener("savedUpdated", fetchSaved);
    return () => window.removeEventListener("savedUpdated", fetchSaved);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
            Saved Scholarships
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginTop: 4 }}>
            Your bookmarked scholarships — all in one place
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
            Loading…
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔖</div>
            <h3 style={{ color: "var(--text)", fontWeight: 600, marginBottom: 8 }}>
              No saved scholarships yet
            </h3>
            <p style={{ color: "var(--text3)", fontSize: "0.9rem", maxWidth: 360, margin: "0 auto" }}>
              Browse scholarships and tap the bookmark icon to save ones you're interested in.
            </p>
            <a
              href="/scholarships"
              style={{
                display: "inline-block", marginTop: 18,
                padding: "10px 20px", background: "var(--accent)",
                color: "#fff", borderRadius: "var(--radius-sm)",
                textDecoration: "none", fontWeight: 600, fontSize: "0.88rem",
              }}
            >
              Browse Scholarships →
            </a>
          </div>
        ) : (
          <>
            <p style={{ fontSize: "0.82rem", color: "var(--text3)", marginBottom: 16 }}>
              {list.length} saved scholarship{list.length !== 1 ? "s" : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {list.map(s => (
                <ScholarshipCard key={s._id} scholarship={s} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}