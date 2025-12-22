import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ScholarshipCard from "../components/ScholarshipCard";
import { getMatchedScholarships } from "../api";

export default function PersonalizedScholarships() {
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    getMatchedScholarships().then((res) =>
      setScholarships(res.data)
    );
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50">
        <h1 className="text-xl font-semibold mb-4">
          Personalized Scholarships
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {scholarships.map((s) => (
            <ScholarshipCard
              key={s._id}
              scholarship={s}
              showMatchScore={true}
            />
          ))}
        </div>
      </div>
    </>
  );
}
