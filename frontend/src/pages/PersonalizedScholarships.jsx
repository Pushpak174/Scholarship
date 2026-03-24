import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ScholarshipCard from "../components/ScholarshipCard";
import { getMatchedScholarships, getAllScholarships } from "../api";
import { useToast } from "../context/ToastContext";

export default function PersonalizedScholarships() {
  const [matched, setMatched]   = useState([]);
  const [all, setAll]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("recommended");
  const toast = useToast();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [matchRes, allRes] = await Promise.allSettled([
        getMatchedScholarships(),
        getAllScholarships(),
      ]);

      if (matchRes.status === "fulfilled") {
        // API may return: array directly, or { data: [...] }, or { data: { data: [...] } }
        const raw = matchRes.value.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        setMatched(list);
      } else {
        toast("Complete your profile to get recommendations", "info");
      }

      if (allRes.status === "fulfilled") {
        const raw = allRes.value.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        setAll(list);
      }
    } catch {
      toast("Failed to load scholarships", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    window.addEventListener("savedUpdated", fetchAll);
    return () => window.removeEventListener("savedUpdated", fetchAll);
  }, []);

  // ── Don't filter expired — ScholarshipCard handles the expired badge
  // Sort matched by matchScore descending
  const sortedMatched = [...matched].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  const displayed     = tab === "recommended" ? sortedMatched : all;

  const hasRecommendations = sortedMatched.length > 0;

  return (
    <>
      <Navbar />
      <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
            Your Scholarships
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginTop: 4 }}>
            Matched to your profile — update your profile to improve recommendations
          </p>
        </div>

      
     

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
            Loading scholarships...
          </div>

        ) : tab === "recommended" && !hasRecommendations ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎯</div>
            <h3 style={{ color: "var(--text)", fontWeight: 600, marginBottom: 8 }}>
              No recommendations yet
            </h3>
            <p style={{ color: "var(--text3)", fontSize: "0.9rem", maxWidth: 380, margin: "0 auto" }}>
              Complete your profile with your course, CGPA, location, and category
              to get personalized scholarship matches.
            </p>
            <a
              href="/profile"
              style={{
                display: "inline-block", marginTop: 18,
                padding: "10px 20px", background: "var(--accent)",
                color: "#fff", borderRadius: "var(--radius-sm)",
                textDecoration: "none", fontWeight: 600, fontSize: "0.88rem",
              }}
            >
              Update Profile →
            </a>
          </div>

        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</div>
            No scholarships found.
          </div>

        ) : (
          <>
            <p style={{ fontSize: "0.82rem", color: "var(--text3)", marginBottom: 16 }}>
              Showing {displayed.length} scholarship{displayed.length !== 1 ? "s" : ""}
              {tab === "recommended" && " · sorted by match score"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {displayed.map(s => (
                <ScholarshipCard
                  key={s._id}
                  scholarship={s}
                  showMatchScore={tab === "recommended"}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}