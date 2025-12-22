import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/website",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= SCHOLARSHIPS =================
export const getAllScholarships = (params = {}) =>
  API.get("/scholarship", { params });

export const getMatchedScholarships = () =>
  API.get("/match");

export const getSavedScholarships = () =>
  API.get("/scholarship/saved");

export const saveScholarship = (id) =>
  API.post(`/scholarship/${id}/save`);

export const unsaveScholarship = (id) =>
  API.post(`/scholarship/${id}/unsave`);

// ================= USER =================
export const getMe = () =>
  API.get("/auth/me");

export const updateProfile = (data) =>
  API.put("/auth/profile", data);

export default API;
