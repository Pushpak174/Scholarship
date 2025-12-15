import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function ScholarshipDetail() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const USER_ID = import.meta.env.VITE_TEST_USER_ID;

  useEffect(() => {
    API.get(`/scholarship/${id}`).then(res => setS(res.data));
  }, []);

  if (!s) return <p>Loading...</p>;

  return (
    <div className="border p-4 rounded">
      <h1 className="text-2xl font-bold">{s.title}</h1>
      <p>{s.provider}</p>
      <p>{s.currency === "USD" ? `$${s.amountValue}` : `₹${s.amountValue}`}</p>

      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => API.post(`/scholarship/${id}/save`, { userId: USER_ID })}
      >
        Save
      </button>
    </div>
  );
}
