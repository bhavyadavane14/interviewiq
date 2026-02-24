console.log("Backend URL:", process.env.NEXT_PUBLIC_API_URL);
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const interviewAPI = {
  start: (data) => api.post('/interviews/start', data),
  submitAnswer: (data) => api.post('/interviews/answer', data),
  complete: (interviewId) => api.post(`/interviews/${interviewId}/complete`),
  getHistory: () => api.get('/interviews/history'),
};

export const evaluationAPI = {
  get: (interviewId) => api.get(`/evaluations/${interviewId}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

export const practiceAPI = {
  getQuestions: (category) => api.get(`/practice/questions/${category}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getUserDetail: (userId) => api.get(`/admin/users/${userId}`),
  getInsights: () => api.get('/admin/insights'),
};

export default api;