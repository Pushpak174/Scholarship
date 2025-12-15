import { useEffect, useState } from "react";
import API from "../api";
import ScholarshipCard from "../components/scholarshipCard";

export default function SavedScholarships() {
  const USER_ID = import.meta.env.VITE_TEST_USER_ID;
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get(`/user/${USER_ID}/saved`)
      .then(res => setData(res.data.savedScholarships));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Saved Scholarships</h2>
      <div className="space-y-3">
        {data.map(s => <ScholarshipCard  key={s._id} s={s} />)}
      </div>
    </div>
  );
}
