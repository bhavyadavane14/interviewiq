import axios from "axios";

// Use Vite environment variable
const BACKEND_URL = import.meta.env.VITE_API_URL;

// Fallback safety (optional but recommended)
if (!BACKEND_URL) {
  console.error("VITE_API_URL is NOT defined");
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

export const interviewAPI = {
  start: (data) => api.post("/interviews/start", data),
  submitAnswer: (data) => api.post("/interviews/answer", data),
  complete: (interviewId) =>
    api.post(`/interviews/${interviewId}/complete`),
  getHistory: () => api.get("/interviews/history"),
};

export const evaluationAPI = {
  get: (interviewId) => api.get(`/evaluations/${interviewId}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get("/analytics/dashboard"),
};

export const practiceAPI = {
  getQuestions: (category) =>
    api.get(`/practice/questions/${category}`),
};

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: () => api.get("/admin/users"),
  getUserDetail: (userId) =>
    api.get(`/admin/users/${userId}`),
  getInsights: () => api.get("/admin/insights"),
};

export default api;