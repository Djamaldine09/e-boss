import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://e-boss-backend.onrender.com/api';

// Create axios instance with base URL
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const message =
      error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/auth/me', userData),
};

export const tutorAPI = {
  getFeedback: (data) => API.post('/tutor/feedback', data),
};

export const factCheckAPI = {
  checkClaim: (data) => API.post('/fact-check', data),
  searchClaims: (params) => API.get('/fact-check/search', { params }),
};

export const quizAPI = {
  generateQuiz: (data) => API.post('/quiz/generate', data),
  validateQuiz: (data) => API.post('/quiz/validate', data),
};

export const planningAPI = {
  generatePlanning: (data) => API.post('/planning/generate', data),
  optimizePlanning: (data) => API.post('/planning/optimize', data),
};

export const healthCheck = () => API.get('/health');

export default API;
