import { useState } from "react";
import API from "../api";

export default function Sidebar({ user, onProfileUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user.profile);

  const saveProfile = async () => {
    const res = await API.put("/auth/profile", form);
    onProfileUpdated(res.data);
    setEditing(false);
  };

  return (
    <div className="w-64 border-r p-4 flex flex-col gap-3">

      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
          {user.name[0]}
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {!editing ? (
        <>
          <div className="text-sm">
            <p><b>Course:</b> {user.profile.course}</p>
            <p><b>CGPA:</b> {user.profile.gpa}</p>
            <p><b>Category:</b> {user.profile.categories.join(", ")}</p>
            <p><b>Location:</b> {user.profile.location}</p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="mt-2 px-3 py-1 border rounded"
          >
            Update Profile
          </button>
        </>
      ) : (
        <>
          <input
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            placeholder="Course"
          />

          <input
            type="number"
            value={form.gpa}
            onChange={(e) => setForm({ ...form, gpa: e.target.value })}
            placeholder="CGPA"
          />

          <input
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            placeholder="Location"
          />

          <select
            multiple
            value={form.categories}
            onChange={(e) =>
              setForm({
                ...form,
                categories: Array.from(
                  e.target.selectedOptions,
                  (o) => o.value
                ),
              })
            }
          >
            <option value="GEN">GEN</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={saveProfile}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
