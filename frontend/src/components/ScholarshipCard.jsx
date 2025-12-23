import { saveScholarship, unsaveScholarship } from "../api";

export default function ScholarshipCard({ scholarship, showMatchScore }) {
  if (!scholarship) return null;

  const {
    _id,
    title,
    provider,
    amount,
    amountValue,
    currency,
    eligibility,
    deadline,
    url,
    matchScore,
    isSaved,
  } = scholarship;

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await unsaveScholarship(_id);
      } else {
        await saveScholarship(_id);
      }

      // 🔥 force global refresh
      window.dispatchEvent(new Event("savedUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const displayAmount = () => {
    if (amountValue && currency) {
      if (currency === "INR")
        return `₹${amountValue.toLocaleString("en-IN")}`;
      if (currency === "USD")
        return `$${amountValue.toLocaleString("en-US")}`;
    }
    return amount || "Not specified";
  };

  return (
    <div className="border rounded p-4 bg-white">
      <h2 className="font-semibold text-lg">{title}</h2>

      {provider && <p>Provider: {provider}</p>}
      <p>Amount: <b>{displayAmount()}</b></p>

      {eligibility?.categories?.length > 0 && (
        <p>Category: {eligibility.categories.join(", ")}</p>
      )}
      {eligibility?.courses?.length > 0 && (
        <p>Course: {eligibility.courses.join(", ")}</p>
      )}
      {eligibility?.locations?.length > 0 && (
        <p>Location: {eligibility.locations.join(", ")}</p>
      )}

      {deadline && (
        <p>Deadline: {new Date(deadline).toLocaleDateString()}</p>
      )}

      {showMatchScore && matchScore !== undefined && (
        <p className="text-green-600">
          Match Score: {matchScore}
        </p>
      )}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline block"
        >
          Apply
        </a>
      )}

      <button
        onClick={toggleSave}
        className="mt-2 px-3 py-1 border rounded"
      >
        {isSaved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
