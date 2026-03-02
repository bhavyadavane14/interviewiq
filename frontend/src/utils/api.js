import axios from "axios";

// ✅ Correct for Create React App
const BACKEND_URL = process.env.REACT_APP_API_URL;

if (!BACKEND_URL) {
  console.error("REACT_APP_API_URL is NOT defined");
}

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export default api;