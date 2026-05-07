import axios from "axios";

// Correct for Create React App
const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000, // 10 seconds
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
  submitAnswer: (data) => api.post("/interviews/submit-answer", data),
  complete: (interviewId) => api.post(`/interviews/${interviewId}/complete`),
  getHistory: () => api.get("/interviews/history"),
};

export const evaluationAPI = {
  get: (interviewId) => api.get(`/evaluations/${interviewId}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get("/analytics/dashboard"),
};

export const practiceAPI = {
  getQuestions: (category) => api.get(`/practice/questions?category=${category}`),
};

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: () => api.get("/admin/users"),
  getUserDetail: (userId) => api.get(`/admin/users/${userId}`),
  getInsights: () => api.get("/admin/insights"),
};

export default api;