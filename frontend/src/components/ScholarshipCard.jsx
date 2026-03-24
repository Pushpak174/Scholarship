import { useState } from "react";
import { saveScholarship, unsaveScholarship } from "../api";
import { useToast } from "../context/ToastContext";

export default function ScholarshipCard({ scholarship, showMatchScore }) {
  if (!scholarship) return null;
  const {
    _id, title, provider, amount, amountValue, currency,
    eligibility, deadline, url, matchScore, isSaved,
  } = scholarship;

  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const now = new Date();
  const deadlineDate = deadline ? new Date(deadline) : null;
  const isExpired = deadlineDate && deadlineDate < now;

  const daysLeft = deadlineDate && !isExpired
    ? Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))
    : null;

  const urgency = daysLeft !== null && daysLeft <= 14;

  const toggleSave = async () => {
    setLoading(true);
    try {
      if (saved) {
        await unsaveScholarship(_id);
        toast("Removed from saved", "info");
      } else {
        await saveScholarship(_id);
        toast("Scholarship saved! ✓", "success");
      }
      setSaved(p => !p);
      window.dispatchEvent(new Event("savedUpdated"));
    } catch {
      toast("Failed to update. Please login again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const displayAmount = () => {
    if (amountValue && currency) {
      if (currency === "INR") return `₹${amountValue.toLocaleString("en-IN")}`;
      if (currency === "USD") return `$${amountValue.toLocaleString("en-US")}`;
    }
    return amount || "Not specified";
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${isExpired ? "var(--border)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: "var(--shadow)",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "default",
        opacity: isExpired ? 0.65 : 1,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        if (!isExpired) {
          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Expired ribbon */}
      {isExpired && (
        <div style={{
          position: "absolute", top: 12, right: -28,
          background: "#e53e3e", color: "#fff",
          fontSize: "0.65rem", fontWeight: 700,
          padding: "3px 36px", transform: "rotate(45deg)",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          Expired
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h2 style={{ fontSize: "0.975rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.4, flex: 1 }}>
          {title}
        </h2>
        {showMatchScore && matchScore !== undefined && (
          <span style={{
            background: "var(--green-light)", color: "var(--green)",
            fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px",
            borderRadius: 20, whiteSpace: "nowrap", fontFamily: "var(--mono)",
          }}>
            {matchScore}% match
          </span>
        )}
      </div>

      {/* Provider */}
      {provider && (
        <p style={{ fontSize: "0.8rem", color: "var(--text3)", fontWeight: 500 }}>
          🏛 {provider}
        </p>
      )}

      {/* Amount */}
      <p style={{
        fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)",
        fontFamily: "var(--mono)", letterSpacing: "-0.02em",
      }}>
        {displayAmount()}
      </p>

      {/* Tags row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {eligibility?.categories?.map(c => (
          <span key={c} style={tagStyle("var(--accent-light)", "var(--accent)")}>{c}</span>
        ))}
        {eligibility?.courses?.slice(0, 2).map(c => (
          <span key={c} style={tagStyle("var(--bg2)", "var(--text2)")}>{c}</span>
        ))}
        {eligibility?.locations?.slice(0, 1).map(l => (
          <span key={l} style={tagStyle("var(--green-light)", "var(--green)")}>📍 {l}</span>
        ))}
      </div>

      {/* Deadline */}
      {deadlineDate && (
        <p style={{
          fontSize: "0.78rem", fontWeight: 600,
          color: isExpired ? "#e53e3e" : urgency ? "#e53e3e" : "var(--text2)",
          fontFamily: "var(--mono)",
        }}>
          {isExpired ? "❌" : urgency ? "⚠️" : "📅"} Deadline:{" "}
          {deadlineDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          {isExpired
            ? " · Closed"
            : daysLeft !== null
              ? ` · ${daysLeft}d left`
              : ""}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1, textAlign: "center",
              background: isExpired ? "var(--bg2)" : "var(--accent)",
              color: isExpired ? "var(--text3)" : "#fff",
              padding: "8px 14px", borderRadius: "var(--radius-sm)",
              fontSize: "0.82rem", fontWeight: 600,
              textDecoration: "none", transition: "opacity 0.2s",
              border: isExpired ? "1px solid var(--border)" : "none",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {isExpired ? "View Details" : "Apply Now →"}
          </a>
        )}
        <button
          onClick={toggleSave}
          disabled={loading}
          style={{
            padding: "8px 14px", borderRadius: "var(--radius-sm)",
            fontSize: "0.82rem", fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            background: saved ? "var(--green-light)" : "var(--bg2)",
            color: saved ? "var(--green)" : "var(--text2)",
            border: `1px solid ${saved ? "var(--green)" : "var(--border)"}`,
            transition: "all 0.2s", opacity: loading ? 0.6 : 1,
            fontFamily: "var(--font)",
          }}
        >
          {loading ? "..." : saved ? "✓ Saved" : "＋ Save"}
        </button>
      </div>
    </div>
  );
}

const tagStyle = (bg, color) => ({
  background: bg, color,
  fontSize: "0.72rem", fontWeight: 600,
  padding: "3px 8px", borderRadius: 20,
});