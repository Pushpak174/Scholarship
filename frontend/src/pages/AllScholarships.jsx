import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ScholarshipCard from "../components/ScholarshipCard";
import { getAllScholarships } from "../api";

export default function AllScholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [boost, setBoost] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    course: "",
    currency: "",
    minAmount: "",
    maxAmount: "",
  });

  const fetchData = async () => {
    const res = await getAllScholarships(filters);
    setScholarships(res.data.data || []);
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("savedUpdated", fetchData);
    return () =>
      window.removeEventListener("savedUpdated", fetchData);
  }, [filters]);

  const displayed = boost
    ? [...scholarships].sort(
        (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
      )
    : scholarships;

  return (
    <>
      <Navbar />

      <div className="p-6 bg-gray-50">
        <h1 className="text-xl font-semibold mb-4">
          All Scholarships
        </h1>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value }))
            }
          >
            <option value="">Category</option>
            <option>GEN</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
            <option>EWS</option>
          </select>

          <select
            onChange={(e) =>
              setFilters((f) => ({ ...f, course: e.target.value }))
            }
          >
            <option value="">Course</option>
            <option>Engineering</option>
            <option>Science</option>
            <option>Arts</option>
            <option>Commerce</option>
          </select>

          <select
            onChange={(e) =>
              setFilters((f) => ({ ...f, currency: e.target.value }))
            }
          >
            <option value="">Currency</option>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>

          <input
            type="number"
            placeholder="Min"
            onChange={(e) =>
              setFilters((f) => ({ ...f, minAmount: e.target.value }))
            }
          />

          <input
            type="number"
            placeholder="Max"
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxAmount: e.target.value }))
            }
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={boost}
              onChange={() => setBoost(!boost)}
            />
            Boost by my profile
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {displayed.map((s) => (
            <ScholarshipCard
              key={s._id}
              scholarship={s}
              showMatchScore={boost}
            />
          ))}
        </div>
      </div>
    </>
  );
}
