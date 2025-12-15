import { Link } from "react-router-dom";

export default function ScholarshipCard({ s }) {
  return (
    <Link to={`/scholarship/${s._id}`} className="block border p-3 rounded hover:shadow">
      <h3 className="font-semibold">{s.title}</h3>
      <p className="text-sm text-gray-600">{s.provider}</p>
      <p className="text-sm">
        {s.currency === "USD" ? `$${s.amountValue}` : `₹${s.amountValue}`}
      </p>
    </Link>
  );
}
