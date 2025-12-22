import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMe, updateProfile } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    getMe().then((res) => {
      setUser(res.data);
      setForm(res.data.profile);
    });
  }, []);

  if (!user || !form) return null;

  const save = async () => {
    const res = await updateProfile(form);
    setUser(res.data);
    alert("Profile updated");
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-md mx-auto bg-white mt-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Profile</h1>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>

        <input
          className="border p-2 w-full mt-2"
          placeholder="Course"
          value={form.course || ""}
          onChange={(e) =>
            setForm({ ...form, course: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mt-2"
          placeholder="CGPA"
          value={form.gpa || ""}
          onChange={(e) =>
            setForm({ ...form, gpa: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mt-2"
          placeholder="Location"
          value={form.location || ""}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mt-2"
          placeholder="Categories (SC, OBC, etc)"
          value={(form.categories || []).join(",")}
          onChange={(e) =>
            setForm({
              ...form,
              categories: e.target.value
                .split(",")
                .map((x) => x.trim()),
            })
          }
        />

        <button
          onClick={save}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </div>
    </>
  );
}
