import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ScholarshipCard from "../components/ScholarshipCard";
import { getMatchedScholarships } from "../api";

export default function PersonalizedScholarships() {
  const [list, setList] = useState([]);

const fetchMatch = async () => {
  try {
    const res = await getMatchedScholarships();
    setList(res.data || []);
  } catch {
    setList([]); // 🔥 SAFE FALLBACK
  }
};

  useEffect(() => {
    fetchMatch();
    window.addEventListener("savedUpdated", fetchMatch);
    return () =>
      window.removeEventListener("savedUpdated", fetchMatch);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50">
        <h1 className="text-xl font-semibold mb-4">
          Recommended Scholarships
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {list.map(s => (
            <ScholarshipCard
              key={s._id}
              scholarship={s}
              showMatchScore
            />
          ))}
        </div>
      </div>
    </>
  );
}
