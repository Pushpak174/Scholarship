import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    gpa: "",
    location: "",
    categories: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCategoryChange = (cat) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/signup", {
        ...form,
        gpa: Number(form.gpa),
      });

      localStorage.setItem("token", res.data.token);
      navigate("/personalized");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-md mx-auto mt-10 space-y-4"
    >
      <h2 className="text-2xl font-semibold">Create Account</h2>

      <input name="name" placeholder="Full Name" onChange={handleChange} className="border p-2 w-full" required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" required />

      <input name="course" placeholder="Course / Degree" onChange={handleChange} className="border p-2 w-full" required />
      <input name="gpa" type="number" step="0.01" placeholder="CGPA" onChange={handleChange} className="border p-2 w-full" required />
      <input name="location" placeholder="Location" onChange={handleChange} className="border p-2 w-full" />

      <div>
        <p className="font-semibold">Category</p>
        {["GEN", "OBC", "SC", "ST", "EWS"].map((cat) => (
          <label key={cat} className="block">
            <input
              type="checkbox"
              checked={form.categories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />{" "}
            {cat}
          </label>
        ))}
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
        Sign Up
      </button>
    </form>
  );
}
