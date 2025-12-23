import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMe, updateProfile } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        if (!res.data) {
          setUser(null);
          setForm(null);
        } else {
          setUser(res.data);
          setForm(res.data.profile || {
            course: "",
            gpa: "",
            location: "",
            categories: [],
          });
        }
      })
      .catch(() => {
        setUser(null);
        setForm(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6">Loading profile…</div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-red-600">
          Please login again to view your profile.
        </div>
      </>
    );
  }

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
          value={form.course}
          onChange={(e) =>
            setForm({ ...form, course: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mt-2"
          placeholder="CGPA"
          value={form.gpa}
          onChange={(e) =>
            setForm({ ...form, gpa: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mt-2"
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mt-2"
          placeholder="Categories (SC, OBC, etc)"
          value={form.categories.join(",")}
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
