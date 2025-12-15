import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import Pagination from "../components/Pagination";
import ScholarshipCard from "../components/scholarshipCard";

export default function ScholarshipList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });

  const params = Object.fromEntries([...searchParams]);

  useEffect(() => {
    API.get("/scholarship", { params })
      .then(res => {
        setData(res.data.data);
        setMeta({ page: res.data.page, totalPages: res.data.totalPages });
      });
  }, [searchParams]);

  function updateParam(key, value) {
    const p = Object.fromEntries([...searchParams]);
    if (value) p[key] = value;
    else delete p[key];
    p.page = 1;
    setSearchParams(p);
  }

  return (
    <div>
      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        <input
          placeholder="Search"
          className="border p-2"
          value={params.q || ""}
          onChange={e => updateParam("q", e.target.value)}
        />

        <select
          className="border p-2"
          value={params.currency || ""}
          onChange={e => updateParam("currency", e.target.value)}
        >
          <option value="">All</option>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>

        <input
          type="number"
          placeholder="Min"
          className="border p-2"
          value={params.minAmount || ""}
          onChange={e => updateParam("minAmount", e.target.value)}
        />

        <input
          type="number"
          placeholder="Max"
          className="border p-2"
          value={params.maxAmount || ""}
          onChange={e => updateParam("maxAmount", e.target.value)}
        />

        <select
          className="border p-2"
          value={params.sort || ""}
          onChange={e => updateParam("sort", e.target.value)}
        >
          <option value="deadline">Deadline</option>
          <option value="amountValue">Amount</option>
        </select>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {data.map(s => <ScholarshipCard key={s._id} s={s} />)}
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={p => setSearchParams({ ...params, page: p })}
      />
    </div>
  );
}
