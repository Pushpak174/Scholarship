import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ScholarshipCard from "../components/ScholarshipCard";
import { getSavedScholarships } from "../api";

export default function SavedScholarships() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getSavedScholarships().then((res) => setList(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50">
        <h1 className="text-xl font-semibold mb-4">
          Saved Scholarships
        </h1>

        {list.length === 0 ? (
          <p>No saved scholarships</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {list.map((s) => (
              <ScholarshipCard key={s._id} scholarship={s} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
