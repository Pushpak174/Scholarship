import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ScholarshipCard from "../components/ScholarshipCard";
import { getAllScholarships } from "../api";

export default function AllScholarships() {
  const [scholarships, setScholarships] = useState([]);

  const [filters, setFilters] = useState({
    category: "",
    course: "",
    currency: "",
    minAmount: "",
    maxAmount: "",
  });

  const [boost, setBoost] = useState(false);
console.log("AllScholarships rendered");

  // ================= FETCH ALL SCHOLARSHIPS =================
  useEffect(() => {
    getAllScholarships(filters)
      .then((res) => {
        setScholarships(res.data.data || []);
      })
      .catch((err) => console.error(err));
  }, [filters]);

  // ================= OPTIONAL BOOST SORT =================
  const displayedScholarships = boost
    ? [...scholarships].sort(
        (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
      )
    : scholarships;

  // ================= UI =================
  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-50">
        <h1 className="text-xl font-semibold mb-4">
          All Scholarships
        </h1>

        {/* ================= FILTER BAR ================= */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                category: e.target.value,
              }))
            }
            className="border px-2 py-1 rounded"
          >
            <option value="">All Categories</option>
            <option value="GEN">GEN</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>

          {/* Course */}
          <select
            value={filters.course}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                course: e.target.value,
              }))
            }
            className="border px-2 py-1 rounded"
          >
            <option value="">All Courses</option>
            <option value="Engineering">Engineering</option>
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
            <option value="Commerce">Commerce</option>
            <option value="Technology">Technology</option>
            <option value="Any">Any</option>
          </select>

          {/* Currency */}
          <select
            value={filters.currency}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                currency: e.target.value,
              }))
            }
            className="border px-2 py-1 rounded"
          >
            <option value="">All Currencies</option>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>

          {/* Min Amount */}
          <input
            type="number"
            placeholder="Min Amount"
            value={filters.minAmount}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                minAmount: e.target.value,
              }))
            }
            className="border px-2 py-1 rounded w-28"
          />

          {/* Max Amount */}
          <input
            type="number"
            placeholder="Max Amount"
            value={filters.maxAmount}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                maxAmount: e.target.value,
              }))
            }
            className="border px-2 py-1 rounded w-28"
          />

          {/* Boost */}
          {/* <label className="flex items-center gap-2 text-sm ml-2">
            <input
              type="checkbox"
              checked={boost}
              onChange={() => setBoost(!boost)}
            />
            Boost by my profile
          </label> */}
        </div>

        {/* ================= LIST ================= */}
        {displayedScholarships.length === 0 ? (
          <p className="text-gray-600">
            No scholarships found.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayedScholarships.map((s) => (
              <ScholarshipCard
                key={s._id}
                scholarship={s}
                showMatchScore={boost}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
