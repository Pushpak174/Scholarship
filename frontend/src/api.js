import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/website",
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ─── Auth ─────────────────────────────────────────── */
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const updateProfile = (data) => API.put("/auth/profile", data);

/* ─── Scholarships ──────────────────────────────────── */
export const getAllScholarships = (filters = {}) =>
  API.get("/scholarship", { params: filters });

export const getSavedScholarships = () => API.get("/scholarship/saved");

export const saveScholarship = (id) => API.post(`/scholarship/${id}/save`);
export const unsaveScholarship = (id) => API.post(`/scholarship/${id}/unsave`);

/* ─── Match ─────────────────────────────────────────── */
export const getMatchedScholarships = () => API.get("/match");